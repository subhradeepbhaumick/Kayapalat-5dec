-- Create database if not exists
CREATE DATABASE IF NOT EXISTS kayapalat_db;
USE kayapalat_db;

-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  image VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert dummy data
INSERT INTO blogs (title, body, image) VALUES
('Designing Interiors that Speak', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut perspiciatis unde omnis iste natus error sit voluptatem...', 'https://kayapalat.co/callback/image/?image=/uploads/blogs/blog-67cd6db4a3954.jpeg&width=370&height=373'),
('Modern Living Room Inspirations', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Temporibus autem quibusdam et aut officiis debitis aut rerum...', 'https://kayapalat.co/callback/image/?image=/uploads/blogs/blog-67a4eeab58ecd.jpg&width=370&height=373'),
('Maximizing Small Spaces', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. At vero eos et accusamus et iusto odio dignissimos ducimus...', 'https://kayapalat.co/callback/image/?image=/uploads/blogs/blog-677bb41a77c19.jpg&width=370&height=373'),
('Creating a Cozy Home Office', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. At vero eos et accusamus et iusto odio dignissimos ducimus...', 'https://kayapalat.co/callback/image/?image=/uploads/blogs/blog-677bb41a77c19.jpg&width=370&height=373'); 