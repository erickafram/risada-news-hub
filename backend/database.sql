-- Criar o banco de dados
CREATE DATABASE IF NOT EXISTS risada_news_hub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Usar o banco de dados
USE risada_news_hub;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('reader', 'admin') NOT NULL DEFAULT 'reader',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de categorias
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de artigos
CREATE TABLE IF NOT EXISTS articles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  content TEXT NOT NULL,
  summary TEXT,
  featured_image VARCHAR(255),
  published BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMP NULL,
  views INT NOT NULL DEFAULT 0,
  author_id INT,
  category_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de favoritos dos usuários
CREATE TABLE IF NOT EXISTS user_favorites (
  user_id INT NOT NULL,
  article_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, article_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir um usuário administrador padrão (senha: admin123)
-- A senha está criptografada com bcrypt, você deve alterá-la após o primeiro login
INSERT INTO users (full_name, email, phone, password, role)
VALUES ('Administrador', 'admin@risadanews.com', '(00) 00000-0000', '$2a$10$ywfGH6ZvpnQEJ/gx9XCxYOAF.UH/9.HjV3Ip5o2H1LxJVyylAJwIq', 'admin');

-- Inserir algumas categorias iniciais
INSERT INTO categories (name, slug, description) VALUES
('Entretenimento', 'entretenimento', 'Notícias sobre entretenimento em geral'),
('Jogos', 'jogos', 'Notícias sobre jogos e videogames'),
('Filmes', 'filmes', 'Notícias sobre filmes e cinema'),
('Música', 'musica', 'Notícias sobre música e shows'),
('Celebridades', 'celebridades', 'Notícias sobre celebridades e famosos'),
('Estilo de Vida', 'estilo-de-vida', 'Notícias sobre estilo de vida e bem-estar');
