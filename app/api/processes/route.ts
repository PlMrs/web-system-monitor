import { NextResponse } from "next/server";
import si from "systeminformation";

export async function GET() {
  try {
    const data = await si.processes();

    const sortedList = data.list;

    return NextResponse.json(sortedList);
  } catch (error) {
    return NextResponse.json({ error: "Erreur process" }, { status: 500 });
  }
}
