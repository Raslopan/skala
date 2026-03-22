-- Seed the database with initial data

-- Insert default users (passwords are hashed versions of 'owner123' and 'guest123')
-- In production, you should use proper bcrypt hashing
INSERT INTO users (email, password_hash, name, role, created_at) VALUES
  ('owner@example.com', 'owner123', 'John Owner', 'owner', '2024-01-01 00:00:00+00'),
  ('guest@example.com', 'guest123', 'Jane Guest', 'guest', '2024-01-15 00:00:00+00')
ON CONFLICT (email) DO NOTHING;

-- Insert properties
INSERT INTO properties (name, type, location, price_per_night, max_guests, bedrooms, bathrooms, amenities, image) VALUES
  ('Seaside Luxury Apartment', 'apartment', 'Miami Beach, FL', 250.00, 4, 2, 2, 
   ARRAY['WiFi', 'Pool', 'Kitchen', 'AC', 'Parking'], 
   'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop'),
  ('Mountain View Villa', 'villa', 'Aspen, CO', 450.00, 8, 4, 3, 
   ARRAY['WiFi', 'Hot Tub', 'Fireplace', 'Kitchen', 'Ski Storage'], 
   'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&auto=format&fit=crop'),
  ('Downtown Studio Loft', 'studio', 'New York, NY', 180.00, 2, 1, 1, 
   ARRAY['WiFi', 'Gym', 'Doorman', 'Washer/Dryer'], 
   'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&auto=format&fit=crop'),
  ('Beachfront House', 'house', 'Malibu, CA', 650.00, 6, 3, 2, 
   ARRAY['WiFi', 'Beach Access', 'BBQ', 'Patio', 'Kitchen'], 
   'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&auto=format&fit=crop')
ON CONFLICT DO NOTHING;

-- Insert reservations (using subqueries to get property IDs)
INSERT INTO reservations (property_id, guest_name, guest_email, check_in, check_out, guests, total_price, status, created_at) VALUES
  ((SELECT id FROM properties WHERE name = 'Seaside Luxury Apartment' LIMIT 1), 
   'John Smith', 'john@example.com', '2026-03-15', '2026-03-20', 2, 1250.00, 'confirmed', '2026-03-01 00:00:00+00'),
  ((SELECT id FROM properties WHERE name = 'Seaside Luxury Apartment' LIMIT 1), 
   'Jane Doe', 'jane@example.com', '2026-03-22', '2026-03-25', 4, 750.00, 'confirmed', '2026-03-05 00:00:00+00'),
  ((SELECT id FROM properties WHERE name = 'Mountain View Villa' LIMIT 1), 
   'Mike Johnson', 'mike@example.com', '2026-03-18', '2026-03-24', 6, 2700.00, 'pending', '2026-03-10 00:00:00+00'),
  ((SELECT id FROM properties WHERE name = 'Downtown Studio Loft' LIMIT 1), 
   'Sarah Wilson', 'sarah@example.com', '2026-03-16', '2026-03-19', 2, 540.00, 'confirmed', '2026-03-08 00:00:00+00'),
  ((SELECT id FROM properties WHERE name = 'Beachfront House' LIMIT 1), 
   'Robert Brown', 'robert@example.com', '2026-03-20', '2026-03-27', 5, 4550.00, 'confirmed', '2026-03-12 00:00:00+00');

-- Insert modules configuration
INSERT INTO modules (id, name, description, icon, enabled, route) VALUES
  ('dashboard', 'Owner Dashboard', 'Property overview and analytics', 'LayoutDashboard', true, '/admin/dashboard'),
  ('properties', 'Property Management', 'Add, edit and manage listings', 'Building2', true, '/admin/properties'),
  ('reservations', 'Manual Booking', 'Create bookings for guests', 'Calendar', true, '/admin/reservations'),
  ('financial', 'Financial Analysis', 'Revenue reports and insights', 'TrendingUp', true, '/admin/financial'),
  ('maintenance', 'Maintenance', 'Property upkeep tracking', 'Wrench', true, '/admin/maintenance'),
  ('employees', 'Employee Management', 'Staff scheduling and payroll', 'Users', false, '/admin/employees')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  enabled = EXCLUDED.enabled,
  route = EXCLUDED.route;

-- Insert sample calendar blocks (maintenance periods)
INSERT INTO calendar_blocks (property_id, start_date, end_date, block_type, notes) VALUES
  ((SELECT id FROM properties WHERE name = 'Seaside Luxury Apartment' LIMIT 1), 
   '2026-03-28', '2026-03-31', 'maintenance', 'End of month cleaning and maintenance');

-- Insert sample maintenance tasks
INSERT INTO maintenance_tasks (property_id, title, description, priority, status, due_date, cost) VALUES
  ((SELECT id FROM properties WHERE name = 'Seaside Luxury Apartment' LIMIT 1), 
   'AC Filter Replacement', 'Replace air conditioning filters in all rooms', 'medium', 'pending', '2026-04-01', 150.00),
  ((SELECT id FROM properties WHERE name = 'Mountain View Villa' LIMIT 1), 
   'Hot Tub Maintenance', 'Annual hot tub servicing and chemical balance check', 'high', 'pending', '2026-03-25', 350.00),
  ((SELECT id FROM properties WHERE name = 'Downtown Studio Loft' LIMIT 1), 
   'Window Cleaning', 'Professional window cleaning service', 'low', 'completed', '2026-03-10', 200.00),
  ((SELECT id FROM properties WHERE name = 'Beachfront House' LIMIT 1), 
   'Deck Repair', 'Fix loose boards on the beachfront deck', 'urgent', 'in_progress', '2026-03-20', 800.00);
