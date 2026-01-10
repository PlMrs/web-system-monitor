import { computeState } from "@/app/functions/functions";
import { execSync } from "child_process";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const output = execSync("sudo ps -ax -o pid,user,stat,%cpu,%mem,comm", {
      encoding: "utf-8",
    });

    const lines = output.trim().split("\n").slice(1);
    const list = lines.map((line) => {
      const parts = line.trim().split(/\s+/);
      return {
        pid: parseInt(parts[0]),
        user: parts[1],
        state: computeState(parts[2]),
        cpu: parseFloat(parts[3]),
        mem: parseFloat(parts[4]),
        name: parts.slice(5).join(" "), // Gère les noms de process avec des espaces
      };
    });

    return NextResponse.json(list);
  } catch (error) {
    return NextResponse.json({ error: "Erreur process" }, { status: 500 });
  }
}
