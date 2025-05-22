-- Проверка текущих значений паролей в таблице
SELECT id, username, password, role FROM users;

-- Проверка типа данных столбца password
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'users' AND column_name = 'password';

-- Обновление паролей для всех пользователей (на случай, если пароли были сохранены с лишними пробелами или в другом формате)
UPDATE users SET password = 'password123' WHERE username = 'admin';
UPDATE users SET password = 'password123' WHERE username = 'manager';
UPDATE users SET password = 'password123' WHERE username = 'employee';
UPDATE users SET password = 'password123' WHERE username = 'guest';

-- Проверка обновленных паролей
SELECT id, username, password, length(password) as password_length, role FROM users; 