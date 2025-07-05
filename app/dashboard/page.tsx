import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <h1>Dashboard</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
