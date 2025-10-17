INSERT INTO users (name, email, password_hash, role)
VALUES
  ('Admin User', 'admin@tools.com', 'hashed_admin_password', 'admin'),
  ('John Doe', 'john.doe@example.com', 'hashed_password_1', 'member'),
  ('Jane Smith', 'jane.smith@example.com', 'hashed_password_2', 'member');

INSERT INTO tools (name, description, category, image_url)
VALUES
  ('Cordless Drill', 'Battery-powered drill suitable for wood and metal.', 'Power Tools', 'https://example.com/images/drill.jpg'),
  ('Lawn Mower', 'Electric lawn mower for small gardens.', 'Gardening', 'https://example.com/images/lawnmower.jpg'),
  ('Hammer', 'Standard claw hammer.', 'Hand Tools', 'https://example.com/images/hammer.jpg'),
  ('Pipe Wrench', 'Adjustable wrench used for gripping pipes.', 'Plumbing', 'https://example.com/images/wrench.jpg');

INSERT INTO reservations (tool_id, user_id, start_date, end_date, status)
VALUES
  (1, 2, '2025-10-15', '2025-10-17', 'closed'),  -- John used Cordless Drill
  (2, 3, '2025-10-16', '2025-10-20', 'active'),  -- Jane currently using Lawn Mower
  (3, 2, '2025-10-22', '2025-10-25', 'pending'); -- John upcoming Hammer booking

INSERT INTO damage_reports (tool_id, user_id, description, image_url, resolved)
VALUES
  (1, 2, 'Drill battery not charging properly.', 'https://example.com/images/damage1.jpg', FALSE),
  (2, 3, 'Lawn mower blade seems dull.', NULL, TRUE);

INSERT INTO reviews (tool_id, user_id, rating, comment)
VALUES
  (1, 2, 5, 'The cordless drill worked perfectly and was easy to handle.'),
  (2, 3, 4, 'Lawn mower was decent, but slightly heavy.'),
  (3, 2, 5, 'Hammer is solid and comfortable to use.');

