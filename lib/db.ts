import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

// Types
export interface User {
  id: string
  email: string
  password: string
  name: string
  role: "admin" | "user"
  avatar?: string
  created_at?: string
}

export interface Property {
  id: string
  name: string
  location: string
  type: string
  bedrooms: number
  bathrooms: number
  max_guests: number
  price_per_night: number
  description: string
  amenities: string[]
  images: string[]
  rating: number
  reviews_count: number
  status: "active" | "inactive" | "maintenance"
  created_at?: string
}

export interface Reservation {
  id: string
  property_id: string
  property_name?: string
  guest_name: string
  guest_email: string
  guest_phone?: string
  check_in: string
  check_out: string
  guests: number
  total_price: number
  status: "confirmed" | "pending" | "cancelled" | "completed"
  payment_status: "paid" | "pending" | "refunded"
  special_requests?: string
  created_at?: string
}

export interface Module {
  id: string
  name: string
  description: string
  icon: string
  enabled: boolean
  category: string
}

export interface MaintenanceTask {
  id: string
  property_id: string
  property_name?: string
  title: string
  description: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "pending" | "in_progress" | "completed" | "cancelled"
  assigned_to?: string
  due_date?: string
  created_at?: string
  completed_at?: string
}

export interface CalendarBlock {
  id: string
  property_id: string
  start_date: string
  end_date: string
  reason: string
  created_at?: string
}

// User functions
export async function getUserByEmail(email: string): Promise<User | null> {
  const users = await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`
  return users[0] as User || null
}

export async function getUserById(id: string): Promise<User | null> {
  const users = await sql`SELECT * FROM users WHERE id = ${id} LIMIT 1`
  return users[0] as User || null
}

export async function getAllUsers(): Promise<User[]> {
  const users = await sql`SELECT * FROM users ORDER BY created_at DESC`
  return users as User[]
}

export async function createUser(user: Omit<User, "id" | "created_at">): Promise<User> {
  const id = crypto.randomUUID()
  await sql`
    INSERT INTO users (id, email, password, name, role, avatar)
    VALUES (${id}, ${user.email}, ${user.password}, ${user.name}, ${user.role}, ${user.avatar || null})
  `
  return { id, ...user } as User
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  const user = await getUserById(id)
  if (!user) return null
  
  const updated = { ...user, ...updates }
  await sql`
    UPDATE users SET 
      email = ${updated.email},
      password = ${updated.password},
      name = ${updated.name},
      role = ${updated.role},
      avatar = ${updated.avatar || null}
    WHERE id = ${id}
  `
  return updated
}

// Property functions
export async function getAllProperties(): Promise<Property[]> {
  const properties = await sql`SELECT * FROM properties ORDER BY created_at DESC`
  return properties as Property[]
}

export async function getActiveProperties(): Promise<Property[]> {
  const properties = await sql`SELECT * FROM properties WHERE status = 'active' ORDER BY created_at DESC`
  return properties as Property[]
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const properties = await sql`SELECT * FROM properties WHERE id = ${id} LIMIT 1`
  return properties[0] as Property || null
}

export async function createProperty(property: Omit<Property, "id" | "created_at">): Promise<Property> {
  const id = crypto.randomUUID()
  await sql`
    INSERT INTO properties (id, name, location, type, bedrooms, bathrooms, max_guests, price_per_night, description, amenities, images, rating, reviews_count, status)
    VALUES (${id}, ${property.name}, ${property.location}, ${property.type}, ${property.bedrooms}, ${property.bathrooms}, ${property.max_guests}, ${property.price_per_night}, ${property.description}, ${property.amenities}, ${property.images}, ${property.rating}, ${property.reviews_count}, ${property.status})
  `
  return { id, ...property } as Property
}

export async function updateProperty(id: string, updates: Partial<Property>): Promise<Property | null> {
  const property = await getPropertyById(id)
  if (!property) return null
  
  const updated = { ...property, ...updates }
  await sql`
    UPDATE properties SET 
      name = ${updated.name},
      location = ${updated.location},
      type = ${updated.type},
      bedrooms = ${updated.bedrooms},
      bathrooms = ${updated.bathrooms},
      max_guests = ${updated.max_guests},
      price_per_night = ${updated.price_per_night},
      description = ${updated.description},
      amenities = ${updated.amenities},
      images = ${updated.images},
      rating = ${updated.rating},
      reviews_count = ${updated.reviews_count},
      status = ${updated.status}
    WHERE id = ${id}
  `
  return updated
}

export async function deleteProperty(id: string): Promise<boolean> {
  await sql`DELETE FROM properties WHERE id = ${id}`
  return true
}

// Reservation functions
export async function getAllReservations(): Promise<Reservation[]> {
  const reservations = await sql`
    SELECT r.*, p.name as property_name 
    FROM reservations r 
    LEFT JOIN properties p ON r.property_id = p.id 
    ORDER BY r.check_in DESC
  `
  return reservations as Reservation[]
}

export async function getReservationById(id: string): Promise<Reservation | null> {
  const reservations = await sql`
    SELECT r.*, p.name as property_name 
    FROM reservations r 
    LEFT JOIN properties p ON r.property_id = p.id 
    WHERE r.id = ${id} LIMIT 1
  `
  return reservations[0] as Reservation || null
}

export async function getReservationsByPropertyId(propertyId: string): Promise<Reservation[]> {
  const reservations = await sql`
    SELECT r.*, p.name as property_name 
    FROM reservations r 
    LEFT JOIN properties p ON r.property_id = p.id 
    WHERE r.property_id = ${propertyId}
    ORDER BY r.check_in DESC
  `
  return reservations as Reservation[]
}

export async function createReservation(reservation: Omit<Reservation, "id" | "created_at" | "property_name">): Promise<Reservation> {
  const id = crypto.randomUUID()
  await sql`
    INSERT INTO reservations (id, property_id, guest_name, guest_email, guest_phone, check_in, check_out, guests, total_price, status, payment_status, special_requests)
    VALUES (${id}, ${reservation.property_id}, ${reservation.guest_name}, ${reservation.guest_email}, ${reservation.guest_phone || null}, ${reservation.check_in}, ${reservation.check_out}, ${reservation.guests}, ${reservation.total_price}, ${reservation.status}, ${reservation.payment_status}, ${reservation.special_requests || null})
  `
  return { id, ...reservation } as Reservation
}

export async function updateReservation(id: string, updates: Partial<Reservation>): Promise<Reservation | null> {
  const reservation = await getReservationById(id)
  if (!reservation) return null
  
  const updated = { ...reservation, ...updates }
  await sql`
    UPDATE reservations SET 
      property_id = ${updated.property_id},
      guest_name = ${updated.guest_name},
      guest_email = ${updated.guest_email},
      guest_phone = ${updated.guest_phone || null},
      check_in = ${updated.check_in},
      check_out = ${updated.check_out},
      guests = ${updated.guests},
      total_price = ${updated.total_price},
      status = ${updated.status},
      payment_status = ${updated.payment_status},
      special_requests = ${updated.special_requests || null}
    WHERE id = ${id}
  `
  return updated
}

export async function deleteReservation(id: string): Promise<boolean> {
  await sql`DELETE FROM reservations WHERE id = ${id}`
  return true
}

// Module functions
export async function getAllModules(): Promise<Module[]> {
  const modules = await sql`SELECT * FROM modules ORDER BY category, name`
  return modules as Module[]
}

export async function updateModuleStatus(id: string, enabled: boolean): Promise<Module | null> {
  await sql`UPDATE modules SET enabled = ${enabled} WHERE id = ${id}`
  const modules = await sql`SELECT * FROM modules WHERE id = ${id} LIMIT 1`
  return modules[0] as Module || null
}

// Maintenance functions
export async function getAllMaintenanceTasks(): Promise<MaintenanceTask[]> {
  const tasks = await sql`
    SELECT m.*, p.name as property_name 
    FROM maintenance_tasks m 
    LEFT JOIN properties p ON m.property_id = p.id 
    ORDER BY m.created_at DESC
  `
  return tasks as MaintenanceTask[]
}

export async function getMaintenanceTaskById(id: string): Promise<MaintenanceTask | null> {
  const tasks = await sql`
    SELECT m.*, p.name as property_name 
    FROM maintenance_tasks m 
    LEFT JOIN properties p ON m.property_id = p.id 
    WHERE m.id = ${id} LIMIT 1
  `
  return tasks[0] as MaintenanceTask || null
}

export async function createMaintenanceTask(task: Omit<MaintenanceTask, "id" | "created_at" | "property_name">): Promise<MaintenanceTask> {
  const id = crypto.randomUUID()
  await sql`
    INSERT INTO maintenance_tasks (id, property_id, title, description, priority, status, assigned_to, due_date)
    VALUES (${id}, ${task.property_id}, ${task.title}, ${task.description}, ${task.priority}, ${task.status}, ${task.assigned_to || null}, ${task.due_date || null})
  `
  return { id, ...task } as MaintenanceTask
}

export async function updateMaintenanceTask(id: string, updates: Partial<MaintenanceTask>): Promise<MaintenanceTask | null> {
  const task = await getMaintenanceTaskById(id)
  if (!task) return null
  
  const updated = { ...task, ...updates }
  const completedAt = updated.status === "completed" ? new Date().toISOString() : task.completed_at
  
  await sql`
    UPDATE maintenance_tasks SET 
      property_id = ${updated.property_id},
      title = ${updated.title},
      description = ${updated.description},
      priority = ${updated.priority},
      status = ${updated.status},
      assigned_to = ${updated.assigned_to || null},
      due_date = ${updated.due_date || null},
      completed_at = ${completedAt || null}
    WHERE id = ${id}
  `
  return { ...updated, completed_at: completedAt }
}

export async function deleteMaintenanceTask(id: string): Promise<boolean> {
  await sql`DELETE FROM maintenance_tasks WHERE id = ${id}`
  return true
}

// Calendar block functions
export async function getCalendarBlocksByPropertyId(propertyId: string): Promise<CalendarBlock[]> {
  const blocks = await sql`
    SELECT * FROM calendar_blocks 
    WHERE property_id = ${propertyId}
    ORDER BY start_date
  `
  return blocks as CalendarBlock[]
}

export async function createCalendarBlock(block: Omit<CalendarBlock, "id" | "created_at">): Promise<CalendarBlock> {
  const id = crypto.randomUUID()
  await sql`
    INSERT INTO calendar_blocks (id, property_id, start_date, end_date, reason)
    VALUES (${id}, ${block.property_id}, ${block.start_date}, ${block.end_date}, ${block.reason})
  `
  return { id, ...block } as CalendarBlock
}

export async function deleteCalendarBlock(id: string): Promise<boolean> {
  await sql`DELETE FROM calendar_blocks WHERE id = ${id}`
  return true
}

// Dashboard statistics
export async function getDashboardStats() {
  const propertiesResult = await sql`SELECT COUNT(*) as count FROM properties WHERE status = 'active'`
  const reservationsResult = await sql`SELECT COUNT(*) as count FROM reservations WHERE status IN ('confirmed', 'pending')`
  const pendingTasksResult = await sql`SELECT COUNT(*) as count FROM maintenance_tasks WHERE status IN ('pending', 'in_progress')`
  const revenueResult = await sql`SELECT COALESCE(SUM(total_price), 0) as total FROM reservations WHERE payment_status = 'paid'`
  
  return {
    totalProperties: Number(propertiesResult[0].count),
    activeReservations: Number(reservationsResult[0].count),
    pendingMaintenanceTasks: Number(pendingTasksResult[0].count),
    totalRevenue: Number(revenueResult[0].total)
  }
}
