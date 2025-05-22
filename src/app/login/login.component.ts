next: (user) => {
  console.log('Успешный вход, получены данные пользователя:', user);
  console.log('Роль пользователя:', user.role);
  
  // Нормализуем роль пользователя в строковый формат enum
  let normalizedRole;
  const roleStr = String(user.role).toLowerCase();
  switch(roleStr) {
    case 'admin': normalizedRole = 'ADMIN'; break;
    case 'manager': normalizedRole = 'MANAGER'; break;
    case 'employee': normalizedRole = 'EMPLOYEE'; break;
    case 'guest': normalizedRole = 'GUEST'; break;
    default: normalizedRole = 'GUEST'; // По умолчанию
  }
  
  // Создаем объект пользователя с нормализованной ролью
  const normalizedUser = {
    ...user,
    role: normalizedRole
  };
  
  // Сохраняем данные пользователя в localStorage
  localStorage.setItem('currentUser', JSON.stringify(normalizedUser));
  console.log('Данные пользователя сохранены в localStorage с ролью:', normalizedRole);
  
  // Обновляем BehaviorSubject в сервисе
  this.authService.refreshCurrentUser();
  
  // Перенаправляем на главную страницу админ-панели
  if (roleStr === 'admin') {
    console.log('Пользователь является администратором, перенаправление на админ-панель');
    this.router.navigate(['/admin']);
  } else {
    console.log(`Перенаправление на ${this.returnUrl}`);
    this.router.navigate([this.returnUrl]);
  }
}, 