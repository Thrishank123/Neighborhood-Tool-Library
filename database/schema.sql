-- Create Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(10) NOT NULL CHECK (role IN ('member', 'admin'))
);

-- Create Tools Table
CREATE TABLE tools (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    image_url TEXT,
    admin_id INTEGER,
    CONSTRAINT fk_admin FOREIGN KEY(admin_id) REFERENCES users(id)
);

-- Create Reservations Table
CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    tool_id INTEGER,
    user_id INTEGER,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(10) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP WITH TIME ZONE,
    approved_by INTEGER,
    CONSTRAINT reservations_status_check CHECK (status IN ('approved', 'active', 'pending', 'rejected', 'closed')),
    CONSTRAINT reservations_tool_id_fkey FOREIGN KEY (tool_id) REFERENCES tools(id) ON DELETE CASCADE,
    CONSTRAINT reservations_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_approved_by FOREIGN KEY (approved_by) REFERENCES users(id)
);

-- Create Damage Reports Table
CREATE TABLE damage_reports (
    id SERIAL PRIMARY KEY,
    tool_id INTEGER,
    user_id INTEGER,
    description TEXT NOT NULL,
    image_url TEXT,
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT damage_reports_tool_id_fkey FOREIGN KEY (tool_id) REFERENCES tools(id) ON DELETE CASCADE,
    CONSTRAINT damage_reports_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Reviews Table
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    tool_id INTEGER,
    user_id INTEGER,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    CONSTRAINT reviews_tool_id_fkey FOREIGN KEY (tool_id) REFERENCES tools(id) ON DELETE CASCADE,
    CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Indexes for performance
CREATE INDEX idx_tools_category ON tools(category);
CREATE INDEX idx_reservations_tool ON reservations(tool_id);
CREATE INDEX idx_reservations_user ON reservations(user_id);
CREATE INDEX idx_damage_tool ON damage_reports(tool_id);
CREATE INDEX idx_reviews_tool ON reviews(tool_id);