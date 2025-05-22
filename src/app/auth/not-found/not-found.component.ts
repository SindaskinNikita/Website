import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="not-found-container" [class.dark-theme]="isDarkTheme">
      <div class="not-found-content">
        <h1>404</h1>
        <h2>Страница не найдена</h2>
        <p>Запрошенная страница не существует или была перемещена.</p>
        <button (click)="goHome()">Вернуться на главную</button>
      </div>
    </div>
  `,
  styles: [`
    .not-found-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f5f5f5;
      text-align: center;
    }
    
    .not-found-container.dark-theme {
      background-color: #2d2d2d;
      color: white;
    }
    
    .not-found-content {
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      max-width: 500px;
    }
    
    .not-found-container.dark-theme .not-found-content {
      background: #3d3d3d;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    }
    
    h1 {
      font-size: 100px;
      margin: 0;
      color: #2196F3;
    }
    
    .not-found-container.dark-theme h1 {
      color: #64B5F6;
    }
    
    h2 {
      margin-top: 0;
      margin-bottom: 20px;
    }
    
    p {
      margin-bottom: 30px;
      font-size: 16px;
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
  `]
})
export class NotFoundComponent {
  isDarkTheme: boolean = false;

  constructor(private router: Router) {
    // Проверяем, установлена ли темная тема
    const theme = localStorage.getItem('theme');
    this.isDarkTheme = theme === 'dark';
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
} 