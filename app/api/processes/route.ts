import { NextResponse } from "next/server";
import si from "systeminformation";

export async function GET() {
  try {
    const data = await si.processes();

    const list = data.list.map(p => ({
      pid: p.pid,
      name: p.name,
      cpu: p.cpu,
      mem: p.mem,
      state: p.state,
      user: p.user,
    }));

    return NextResponse.json(list);
  } catch (error) {
    return NextResponse.json({ error: "Erreur process" }, { status: 500 });
  }
}
