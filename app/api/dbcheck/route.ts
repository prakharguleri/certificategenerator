import { connectToDB } from '@/lib/mongodb';
import User from '@/lib/user';

export async function GET() {
  try {
    await connectToDB();
    const users = await User.find({});
    return Response.json(users);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : 'Unknown error occurred';
    return new Response('DB Error: ' + errorMessage, { status: 500 });
  }
}
