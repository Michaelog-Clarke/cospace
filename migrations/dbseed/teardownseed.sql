-- 1. Remove Bookings (Depends on Users and Desks)
DELETE FROM bookings 
WHERE (user_id IN (1, 2, 3, 4, 5, 6) AND desk_id IN (1, 2, 3, 4) AND booking_date IN ('2026-09-17', '2026-09-18'));

-- 2. Remove Desks
DELETE FROM desks 
WHERE id IN (1, 2, 3, 4);

-- 3. Remove Rooms
DELETE FROM rooms 
WHERE name IN ('Boardroom A', 'Huddle Room 1', 'Creative Studio') 
  AND floor IN (1, 2);

-- 4. Remove Users (Depends on Teams)
DELETE FROM users 
WHERE email IN (
  'alice.smith@example.com',
  'bob.jones@example.com',
  'charlie.brown@example.com',
  'diana.prince@example.com',
  'evan.wright@example.com',
  'fiona.gallagher@example.com',
  'george.clark@example.com',
  'hannah.abbott@example.com'
);
