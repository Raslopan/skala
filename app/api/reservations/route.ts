import { NextResponse } from "next/server"
import { getAllReservations, getReservationsByPropertyId, createReservation } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const propertyId = searchParams.get("propertyId")
    
    const reservations = propertyId
      ? await getReservationsByPropertyId(propertyId)
      : await getAllReservations()
    
    return NextResponse.json(reservations)
  } catch (error) {
    console.error("Error fetching reservations:", error)
    return NextResponse.json(
      { error: "Failed to fetch reservations" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const reservation = await createReservation(data)
    return NextResponse.json(reservation)
  } catch (error) {
    console.error("Error creating reservation:", error)
    return NextResponse.json(
      { error: "Failed to create reservation" },
      { status: 500 }
    )
  }
}
