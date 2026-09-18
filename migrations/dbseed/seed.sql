-- 1. Seed Teams (3 Teams)
-- INSERT INTO teams (name, department) VALUES
-- ('Alpha Squad', 'Engineering'),
-- ('Beta Builders', 'Product'),
-- ('Gamma Growth', 'Marketing');

-- 2. Seed Users / Colleagues (8 Users distributed across teams)
-- (Assuming Alpha Squad is team 1, Beta Builders is team 2, Gamma Growth is team 3)
INSERT INTO users (first_name, last_name, email, team_id) VALUES
--('Alice', 'Smith', 'alice.smith@example.com', 1),
('Bob', 'Jones', 'bob.jones@example.com', 1),
('Charlie', 'Brown', 'charlie.brown@example.com', 1),
('Diana', 'Prince', 'diana.prince@example.com', 2),
('Evan', 'Wright', 'evan.wright@example.com', 2),
('Fiona', 'Gallagher', 'fiona.gallagher@example.com', 2),
('George', 'Clark', 'george.clark@example.com', 3),
('Hannah', 'Abbott', 'hannah.abbott@example.com', 3);

-- 3. Seed Rooms (3 Meeting Rooms)
INSERT INTO rooms (name, floor, capacity) VALUES
('Boardroom A', 1, 12),
('Huddle Room 1', 1, 4),
('Creative Studio', 2, 8);

-- 4. Seed Desks (4 Desks)
INSERT INTO desks (name, floor) VALUES
('Desk-101', 1),
('Desk-102', 1),
('Desk-201', 2),
('Desk-202', 2);

-- 5. Seed Bookings (6 Bookings linking users to desks on different dates)
-- (Assuming Users 1-8 and Desks 1-4 correspond to the auto-incremented IDs from above)
INSERT INTO bookings (user_id, desk_id, booking_date) VALUES
(1, 1, '2026-09-17'), -- Alice booking Desk-101
(2, 2, '2026-09-17'), -- Bob booking Desk-102
(3, 1, '2026-09-18'), -- Charlie booking Desk-101
(4, 3, '2026-09-17'), -- Diana booking Desk-201
(5, 4, '2026-09-18'), -- Evan booking Desk-202
(6, 3, '2026-09-18'); -- Fiona booking Desk-201

