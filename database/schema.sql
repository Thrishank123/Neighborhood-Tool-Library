CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(10) CHECK(role IN ('member', 'admin')) NOT NULL,
  reset_token TEXT,
  reset_expires TIMESTAMP
);


CREATE TABLE tools (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  image_url TEXT
);


CREATE TABLE reservations (
  id SERIAL PRIMARY KEY,
  tool_id INT REFERENCES tools(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(15) CHECK(status IN ('approved', 'active', 'pending', 'rejected', 'closed')) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP,
  approved_by INT REFERENCES users(id)
);


CREATE TABLE damage_reports (
  id SERIAL PRIMARY KEY,
  tool_id INT REFERENCES tools(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  image_url TEXT,
  resolved BOOLEAN DEFAULT FALSE
);

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  tool_id INT REFERENCES tools(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  rating INT CHECK(rating BETWEEN 1 AND 5) NOT NULL,
  comment TEXT
);


CREATE INDEX idx_tools_category ON tools(category);
CREATE INDEX idx_reservations_tool ON reservations(tool_id);
CREATE INDEX idx_reservations_user ON reservations(user_id);
CREATE INDEX idx_damage_tool ON damage_reports(tool_id);
CREATE INDEX idx_reviews_tool ON reviews(tool_id);
