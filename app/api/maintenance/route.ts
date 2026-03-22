import { NextResponse } from "next/server"
import { getAllMaintenanceTasks, createMaintenanceTask } from "@/lib/db"

export async function GET() {
  try {
    const tasks = await getAllMaintenanceTasks()
    return NextResponse.json(tasks)
  } catch (error) {
    console.error("Error fetching maintenance tasks:", error)
    return NextResponse.json(
      { error: "Failed to fetch maintenance tasks" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const task = await createMaintenanceTask(data)
    return NextResponse.json(task)
  } catch (error) {
    console.error("Error creating maintenance task:", error)
    return NextResponse.json(
      { error: "Failed to create maintenance task" },
      { status: 500 }
    )
  }
}
