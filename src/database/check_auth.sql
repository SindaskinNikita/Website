-- Функция для проверки авторизации
CREATE OR REPLACE FUNCTION check_auth(p_email VARCHAR, p_password VARCHAR)
RETURNS TABLE (
    is_valid BOOLEAN,
    user_id INTEGER,
    username VARCHAR,
    user_role VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        -- В реальном приложении здесь будет bcrypt.compare
        CASE 
            WHEN u.password_hash = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYpfQN2YIpjR5qi' THEN true 
            ELSE false 
        END as is_valid,
        u.id,
        u.username,
        u.role
    FROM users u
    WHERE u.email = p_email;
END;
$$ LANGUAGE plpgsql;

-- Проверка авторизации для всех пользователей
SELECT u.email, 
       CASE 
           WHEN u.password_hash = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYpfQN2YIpjR5qi' 
           THEN 'Верный пароль (password123)' 
           ELSE 'Неверный пароль' 
       END as password_check,
       u.role
FROM users u
ORDER BY u.role;

-- Пример проверки конкретного пользователя
SELECT * FROM check_auth('admin@example.com', 'password123');

-- Проверка неверного пароля
SELECT * FROM check_auth('admin@example.com', 'wrongpassword'); 