import { NextResponse } from "next/server";
import { createUser, getAllUsers, User } from "../../../lib/users";

export async function GET() {
  const users = getAllUsers();
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Request body must be a JSON object" }, { status: 400 });
  }

  const { name, email, totalSpent, ordersCount, status, lastActive } = body as Partial<User>;

  if (!name || !email) {
    return NextResponse.json({ error: "Missing required fields: name, email" }, { status: 400 });
  }

  const newUser = createUser({
    name: String(name),
    email: String(email),
    totalSpent: typeof totalSpent === "number" ? totalSpent : 0,
    ordersCount: typeof ordersCount === "number" ? ordersCount : 0,
    status: status ? String(status) : "Novo",
    lastActive: lastActive ? String(lastActive) : new Date().toISOString().split("T")[0],
  });

  return NextResponse.json(newUser, { status: 201 });
}
