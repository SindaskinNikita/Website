import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-box" [class.dark-theme]="isDarkTheme">
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
          <div class="error-message" *ngIf="errorMessage">{{errorMessage}}</div>
          <button type="submit" [disabled]="!username || !password">Войти</button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
    }

    .login-box {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }

    .login-box.dark-theme {
      background: #2d2d2d;
      color: #fff;
    }

    h2 {
      text-align: center;
      margin-bottom: 2rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
    }

    input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    button {
      width: 100%;
      padding: 0.75rem;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      margin-top: 1rem;
    }

    button:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }

    .error-message {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.5rem;
      text-align: center;
    }
  `]
})
export class LoginComponent {
  username: string = 'admin'; // Значение по умолчанию для тестирования
  password: string = 'password123'; // Значение по умолчанию для тестирования
  errorMessage: string = '';
  isDarkTheme: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage = '';
    
    console.log('Попытка входа с данными:', { username: this.username, password: this.password });
    
    this.authService.login(this.username, this.password).subscribe({
      next: (user) => {
        console.log('Успешная авторизация, получен пользователь:', user);
        console.log('Перенаправление в админ-панель');
        // Успешная авторизация
        this.router.navigate(['/admin']);
      },
      error: (error) => {
        this.errorMessage = 'Неверное имя пользователя или пароль';
        console.error('Ошибка авторизации:', error);
      }
    });
  }
} 