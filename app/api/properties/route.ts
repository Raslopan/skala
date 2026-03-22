import { NextResponse } from "next/server"
import { getAllProperties, getActiveProperties, createProperty } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get("active") === "true"
    
    const properties = activeOnly 
      ? await getActiveProperties() 
      : await getAllProperties()
    
    return NextResponse.json(properties)
  } catch (error) {
    console.error("Error fetching properties:", error)
    return NextResponse.json(
      { error: "Failed to fetch properties" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const property = await createProperty(data)
    return NextResponse.json(property)
  } catch (error) {
    console.error("Error creating property:", error)
    return NextResponse.json(
      { error: "Failed to create property" },
      { status: 500 }
    )
  }
}
