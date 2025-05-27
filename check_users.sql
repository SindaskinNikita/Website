-- Проверяем существование схемы public
SELECT EXISTS (
    SELECT 1 FROM information_schema.schemata WHERE schema_name = 'public'
);

-- Проверяем существование типа user_role
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'manager', 'employee', 'guest');
    END IF;
END$$;

-- Проверяем существование таблицы users
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'users'
);

-- Создаем таблицу users, если ее еще нет
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'guest',
    token VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Создаем индексы
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Создаем функцию обновления timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Создаем триггер, если его еще нет
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_trigger 
        WHERE tgname = 'update_users_updated_at'
    ) THEN
        CREATE TRIGGER update_users_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
END$$;

-- Проверяем наличие пользователя admin
SELECT EXISTS (
    SELECT 1 FROM users WHERE username = 'admin'
) AS admin_exists;

-- Если пользователя admin нет, добавляем тестовых пользователей
DO $$
DECLARE
    admin_exists BOOLEAN;
BEGIN
    SELECT EXISTS (SELECT 1 FROM users WHERE username = 'admin') INTO admin_exists;
    
    IF NOT admin_exists THEN
        -- Добавляем тестовых пользователей
        INSERT INTO users (username, email, password, role) VALUES
        ('admin', 'admin@example.com', 'password123', 'admin'),
        ('manager', 'manager@example.com', 'password123', 'manager'),
        ('employee', 'employee@example.com', 'password123', 'employee'),
        ('guest', 'guest@example.com', 'password123', 'guest');
    END IF;
END$$;

-- Выводим список пользователей
SELECT id, username, email, role FROM users; 