import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string; // ✅ optional for Google users
  approved: boolean;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // ✅ made optional
  approved: { type: Boolean, default: false },
});

// ✅ Only hash password if it's been modified and exists
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  try {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// ✅ Skip password check if user has no password (e.g. Google login)
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

const User: Model<IUser> =
  mongoose.models.LoginUser || mongoose.model<IUser>('LoginUser', UserSchema, 'loginuser');

export default User;
