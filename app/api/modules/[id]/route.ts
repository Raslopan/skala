import { NextResponse } from "next/server"
import { updateModuleStatus } from "@/lib/db"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { enabled } = await request.json()
    const module = await updateModuleStatus(id, enabled)
    
    if (!module) {
      return NextResponse.json(
        { error: "Module not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json(module)
  } catch (error) {
    console.error("Error updating module:", error)
    return NextResponse.json(
      { error: "Failed to update module" },
      { status: 500 }
    )
  }
}
