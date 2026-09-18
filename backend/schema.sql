-- Schema for the app database.
-- Run this once against an empty MySQL database, e.g.:
--   mysql -h <host> -P <port> -u <user> -p <database> < schema.sql

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(120) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL,
  subject VARCHAR(190) DEFAULT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(60) DEFAULT NULL,
  sort_order INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed a few services so the Service page has content out of the box.
INSERT INTO services (title, description, icon, sort_order) VALUES
  ('Web Development', 'Custom, responsive websites and web applications built with modern frameworks.', 'code', 1),
  ('API Integration', 'Designing and connecting REST/GraphQL APIs to power your product.', 'plug', 2),
  ('Database Design', 'Schema design, optimization, and migrations for relational databases.', 'database', 3),
  ('Cloud Deployment', 'Deploying and configuring apps on cloud platforms with CI/CD.', 'cloud', 4)
ON DUPLICATE KEY UPDATE title = VALUES(title);
