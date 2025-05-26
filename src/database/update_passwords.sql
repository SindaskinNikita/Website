-- Обновление паролей для существующих пользователей
-- Пароль для всех: password123
-- Хеш сгенерирован с помощью bcrypt с salt rounds = 12

UPDATE users 
SET password_hash = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYpfQN2YIpjR5qi'
WHERE email IN (
    'admin@example.com',
    'manager@example.com',
    'employee1@example.com',
    'employee2@example.com',
    'guest@example.com'
);

-- Проверка обновления
SELECT username, email, role, substring(password_hash, 1, 30) || '...' as hashed_password 
FROM users 
ORDER BY role; 