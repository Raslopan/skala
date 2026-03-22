import { NextResponse } from "next/server"
import { getReservationById, updateReservation, deleteReservation } from "@/lib/db"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const reservation = await getReservationById(id)
    
    if (!reservation) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json(reservation)
  } catch (error) {
    console.error("Error fetching reservation:", error)
    return NextResponse.json(
      { error: "Failed to fetch reservation" },
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
    const reservation = await updateReservation(id, data)
    
    if (!reservation) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json(reservation)
  } catch (error) {
    console.error("Error updating reservation:", error)
    return NextResponse.json(
      { error: "Failed to update reservation" },
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
    await deleteReservation(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting reservation:", error)
    return NextResponse.json(
      { error: "Failed to delete reservation" },
      { status: 500 }
    )
  }
}
