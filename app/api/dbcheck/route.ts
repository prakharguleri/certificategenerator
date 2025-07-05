import { connectToDB } from '@/lib/mongodb';
import User from '@/lib/user';

export async function GET() {
  try {
    await connectToDB();
    const users = await User.find({});
    return Response.json(users);
  } catch (err: any) {
    return new Response("DB Error: " + err.message, { status: 500 });
  }
}
