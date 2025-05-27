import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-logout-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button class="logout-btn" (click)="logout()">Выйти из системы</button>
  `,
  styles: [`
    .logout-btn {
      padding: 8px 16px;
      background-color: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: background-color 0.3s;
      margin: 0;
    }
    
    .logout-btn:hover {
      background-color: #c82333;
    }
  `]
})
export class LogoutButtonComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  logout(): void {
    console.log('Нажата кнопка выхода из системы');
    
    // Очистка localStorage напрямую
    localStorage.removeItem('currentUser');
    console.log('Данные пользователя удалены из localStorage');
    
    // Обновление состояния сервиса
    this.authService.logout();
    
    // Перенаправление на страницу входа
    console.log('Перенаправление на страницу входа');
    this.router.navigate(['/login']);
  }
} 