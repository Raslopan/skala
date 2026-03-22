import { NextResponse } from "next/server"
import { getAllModules } from "@/lib/db"

export async function GET() {
  try {
    const modules = await getAllModules()
    return NextResponse.json(modules)
  } catch (error) {
    console.error("Error fetching modules:", error)
    return NextResponse.json(
      { error: "Failed to fetch modules" },
      { status: 500 }
    )
  }
}
