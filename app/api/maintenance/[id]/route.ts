import { NextResponse } from "next/server"
import { getMaintenanceTaskById, updateMaintenanceTask, deleteMaintenanceTask } from "@/lib/db"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const task = await getMaintenanceTaskById(id)
    
    if (!task) {
      return NextResponse.json(
        { error: "Maintenance task not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json(task)
  } catch (error) {
    console.error("Error fetching maintenance task:", error)
    return NextResponse.json(
      { error: "Failed to fetch maintenance task" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()
    const task = await updateMaintenanceTask(id, data)
    
    if (!task) {
      return NextResponse.json(
        { error: "Maintenance task not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json(task)
  } catch (error) {
    console.error("Error updating maintenance task:", error)
    return NextResponse.json(
      { error: "Failed to update maintenance task" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await deleteMaintenanceTask(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting maintenance task:", error)
    return NextResponse.json(
      { error: "Failed to delete maintenance task" },
      { status: 500 }
    )
  }
}
