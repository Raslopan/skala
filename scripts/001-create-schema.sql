-- Create the database schema for Skala property management system

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'guest' CHECK (role IN ('guest', 'owner', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('apartment', 'house', 'villa', 'studio')),
  location VARCHAR(255) NOT NULL,
  price_per_night DECIMAL(10, 2) NOT NULL,
  max_guests INTEGER NOT NULL,
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  amenities TEXT[] DEFAULT '{}',
  image VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id SERIAL PRIMARY KEY,
  property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  guest_name VARCHAR(255) NOT NULL,
  guest_email VARCHAR(255) NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('confirmed', 'pending', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Modules table for the modular system configuration
CREATE TABLE IF NOT EXISTS modules (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  enabled BOOLEAN DEFAULT true,
  route VARCHAR(255) NOT NULL
);

-- Calendar blocks table for maintenance and blocked dates
CREATE TABLE IF NOT EXISTS calendar_blocks (
  id SERIAL PRIMARY KEY,
  property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  block_type VARCHAR(50) NOT NULL CHECK (block_type IN ('maintenance', 'blocked')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Maintenance tasks table
CREATE TABLE IF NOT EXISTS maintenance_tasks (
  id SERIAL PRIMARY KEY,
  property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  priority VARCHAR(50) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  due_date DATE,
  cost DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reservations_property_id ON reservations(property_id);
CREATE INDEX IF NOT EXISTS idx_reservations_check_in ON reservations(check_in);
CREATE INDEX IF NOT EXISTS idx_reservations_check_out ON reservations(check_out);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_calendar_blocks_property_id ON calendar_blocks(property_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_tasks_property_id ON maintenance_tasks(property_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
