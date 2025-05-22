import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="forbidden-container" [class.dark-theme]="isDarkTheme">
      <div class="forbidden-content">
        <h1>403</h1>
        <h2>Доступ запрещен</h2>
        <p>У вас нет прав для доступа к запрошенной странице.</p>
        <div class="button-group">
          <button (click)="goHome()">Вернуться на главную</button>
          <button (click)="logout()" class="logout-btn">Выйти из системы</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .forbidden-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f5f5f5;
      text-align: center;
    }
    
    .forbidden-container.dark-theme {
      background-color: #2d2d2d;
      color: white;
    }
    
    .forbidden-content {
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      max-width: 500px;
    }
    
    .forbidden-container.dark-theme .forbidden-content {
      background: #3d3d3d;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    }
    
    h1 {
      font-size: 80px;
      margin: 0;
      color: #dc3545;
    }
    
    .forbidden-container.dark-theme h1 {
      color: #ff6b6b;
    }
    
    h2 {
      margin-top: 0;
      margin-bottom: 20px;
    }
    
    p {
      margin-bottom: 30px;
      font-size: 16px;
    }
    
    .button-group {
      display: flex;
      gap: 10px;
      justify-content: center;
    }
    
    button {
      padding: 12px 25px;
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
    
    .logout-btn {
      background-color: #dc3545;
    }
    
    .logout-btn:hover {
      background-color: #c82333;
    }
  `]
})
export class ForbiddenComponent {
  isDarkTheme: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    // Проверяем, установлена ли темная тема
    const theme = localStorage.getItem('theme');
    this.isDarkTheme = theme === 'dark';
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
  
  logout(): void {
    console.log('Вызван метод logout в ForbiddenComponent');
    
    try {
      // Очищаем все возможные данные авторизации
      localStorage.clear();
      console.log('Локальное хранилище очищено');
      
      // Удаляем конкретно данные пользователя
      localStorage.removeItem('currentUser');
      console.log('Данные пользователя удалены из localStorage');
      
      // Попытка вызова метода logout в сервисе (для очистки состояния)
      try {
        this.authService.logout();
        console.log('Вызван метод logout в AuthService');
      } catch (error) {
        console.error('Ошибка при вызове authService.logout():', error);
      }
    } catch (error) {
      console.error('Ошибка при очистке данных:', error);
    }
    
    // Полное перенаправление с перезагрузкой страницы
    console.log('Перенаправление на страницу входа');
    window.location.href = '/login';
  }
} 