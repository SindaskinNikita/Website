-- Проверяем наличие пользователя admin и добавляем его, если отсутствует
DO $$
DECLARE
    admin_exists BOOLEAN;
BEGIN
    -- Проверяем существование типа user_role
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'manager', 'employee', 'guest');
    END IF;
    
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
    
    -- Проверяем наличие пользователя admin
    SELECT EXISTS (SELECT 1 FROM users WHERE username = 'admin') INTO admin_exists;
    
    IF NOT admin_exists THEN
        -- Добавляем пользователя admin
        INSERT INTO users (username, email, password, role) VALUES
        ('admin', 'admin@example.com', 'password123', 'admin');
        RAISE NOTICE 'Пользователь admin добавлен';
    ELSE
        -- Обновляем пароль для admin, если пользователь существует
        UPDATE users SET password = 'password123' WHERE username = 'admin';
        RAISE NOTICE 'Пароль пользователя admin обновлен';
    END IF;
END$$;

-- Проверяем содержимое таблицы users
SELECT id, username, email, password, role FROM users; 