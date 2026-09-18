-- 1. Show each user and the team they belong to.
SELECT
    u.first_name,
    u.last_name,
    u.email,
    t.name AS team_name,
    t.department
FROM users AS u
INNER JOIN teams AS t
    ON t.id = u.team_id
ORDER BY t.name, u.last_name, u.first_name;

-- 2. Show every booking with the user and desk details.
SELECT
    b.booking_date,
    CONCAT(u.first_name, ' ', u.last_name) AS user_name,
    t.name AS team_name,
    d.name AS desk_name,
    d.floor
FROM bookings AS b
INNER JOIN users AS u
    ON u.id = b.user_id
INNER JOIN teams AS t
    ON t.id = u.team_id
INNER JOIN desks AS d
    ON d.id = b.desk_id
ORDER BY b.booking_date, d.name;

-- 3. Count bookings for each team, including teams with no bookings.
SELECT
    t.name AS team_name,
    t.department,
    COUNT(b.id) AS booking_count
FROM teams AS t
LEFT JOIN users AS u
    ON u.team_id = t.id
LEFT JOIN bookings AS b
    ON b.user_id = u.id
GROUP BY t.id, t.name, t.department
ORDER BY booking_count DESC, t.name;

-- 4. Find desks that have been booked, and show how many bookings each has.
SELECT
    d.name AS desk_name,
    d.floor,
    COUNT(b.id) AS booking_count
FROM desks AS d
LEFT JOIN bookings AS b
    ON b.desk_id = d.id
GROUP BY d.id, d.name, d.floor
ORDER BY d.floor, d.name;
