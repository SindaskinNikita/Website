import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, UserRole } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container" [class.dark-theme]="isDarkTheme">
      <div class="login-form">
        <h2>Вход в систему</h2>
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="username">Имя пользователя</label>
            <input 
              type="text" 
              id="username" 
              [(ngModel)]="username" 
              name="username" 
              required
              placeholder="Введите имя пользователя">
          </div>
          
          <div class="form-group">
            <label for="password">Пароль</label>
            <input 
              type="password" 
              id="password" 
              [(ngModel)]="password" 
              name="password" 
              required
              placeholder="Введите пароль">
          </div>
          
          <div class="error-message" *ngIf="errorMessage">{{ errorMessage }}</div>
          
          <button type="submit" [disabled]="loading">
            <span *ngIf="loading">Загрузка...</span>
            <span *ngIf="!loading">Войти</span>
          </button>
        </form>

        <div class="login-footer" *ngIf="showHints">
          <h3>Для демонстрации:</h3>
          <ul>
            <li><strong>Администратор:</strong> username: admin, пароль: password123</li>
            <li><strong>Менеджер:</strong> username: manager, пароль: password123</li>
            <li><strong>Сотрудник:</strong> username: employee, пароль: password123</li>
            <li><strong>Гость:</strong> username: guest, пароль: password123</li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f5f5f5;
    }
    
    .login-container.dark-theme {
      background-color: #2d2d2d;
      color: white;
    }
    
    .login-form {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }
    
    .login-container.dark-theme .login-form {
      background: #3d3d3d;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    }
    
    h2 {
      text-align: center;
      margin-bottom: 30px;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
    }
    
    input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      box-sizing: border-box;
    }
    
    .login-container.dark-theme input {
      background: #4d4d4d;
      border-color: #5d5d5d;
      color: white;
    }
    
    input:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }
    
    .login-container.dark-theme input:focus {
      border-color: #5d9eff;
      box-shadow: 0 0 0 2px rgba(93, 158, 255, 0.25);
    }
    
    button {
      width: 100%;
      padding: 12px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      font-weight: 500;
      transition: background-color 0.3s;
    }
    
    button:hover {
      background-color: #45a049;
    }
    
    button:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }
    
    .error-message {
      color: #dc3545;
      margin-bottom: 15px;
      text-align: center;
    }
    
    .login-container.dark-theme .error-message {
      color: #ff6b6b;
    }

    .login-footer {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }
    
    .login-container.dark-theme .login-footer {
      border-top-color: #4d4d4d;
    }
    
    .login-footer h3 {
      font-size: 16px;
      margin-bottom: 10px;
    }
    
    .login-footer ul {
      padding-left: 20px;
      margin: 0;
    }
    
    .login-footer li {
      margin-bottom: 5px;
      font-size: 14px;
    }
  `]
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  loading: boolean = false;
  errorMessage: string = '';
  returnUrl: string = '/';
  isDarkTheme: boolean = false;
  showHints: boolean = true; // Флаг для отображения подсказок для демонстрации

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Получаем URL для перенаправления после успешного входа
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    
    // Проверяем, установлена ли темная тема
    const theme = localStorage.getItem('theme');
    this.isDarkTheme = theme === 'dark';

    // Проверяем, авторизован ли пользователь, и если да, перенаправляем его
    if (this.authService.isLoggedIn()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  onSubmit(): void {
    this.loading = true;
    this.errorMessage = '';

    console.log('Начало процесса входа');
    // Проверка на пустые поля
    if (!this.username.trim() || !this.password.trim()) {
      this.errorMessage = 'Пожалуйста, введите имя пользователя и пароль';
      this.loading = false;
      return;
    }

    console.log(`Отправка запроса на вход: ${this.username}`);
    this.authService.login(this.username, this.password)
      .subscribe({
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
          if (this.authService.refreshCurrentUser) {
            this.authService.refreshCurrentUser();
          }
          
          // Перенаправляем на главную страницу админ-панели
          if (roleStr === 'admin') {
            console.log('Пользователь является администратором, перенаправление на админ-панель');
            this.router.navigate(['/admin']);
          } else {
            console.log(`Перенаправление на ${this.returnUrl}`);
            this.router.navigate([this.returnUrl]);
          }
        },
        error: (error) => {
          console.error('Ошибка при входе:', error);
          
          if (error instanceof HttpErrorResponse) {
            // Если сервер вернул сообщение об ошибке
            this.errorMessage = error.error?.message || 'Ошибка при входе';
          } else {
            // Если ошибка не связана с HTTP (например, ошибка в сервисе)
            this.errorMessage = error.message || 'Ошибка при входе';
          }
          
          this.loading = false;
        }
      });
  }
} 