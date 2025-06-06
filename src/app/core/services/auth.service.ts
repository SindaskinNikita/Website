import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import * as bcrypt from 'bcryptjs';

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE' | 'GUEST';
}

export interface LoginResponse {
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private readonly API_URL = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {
    // Проверяем наличие сохраненного токена при инициализации
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(username: string, password: string): Observable<LoginResponse> {
    console.log('AuthService.login вызван с:', { username, password });
    
    return this.http.post<any>(`${this.API_URL}/login`, { username, password }).pipe(
      map(response => {
        console.log('Ответ от сервера:', response);
        
        // Преобразуем ответ в нужный формат
        const user: User = {
          id: response.id,
          username: response.username,
          email: response.email,
          role: response.role.toUpperCase() as 'ADMIN' | 'MANAGER' | 'EMPLOYEE' | 'GUEST'
        };
        
        const loginResponse: LoginResponse = {
          user: user,
          token: response.token
        };
        
        console.log('Преобразованный ответ:', loginResponse);
        return loginResponse;
      }),
      tap(response => {
        console.log('Сохранение данных пользователя в localStorage');
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        localStorage.setItem('token', response.token);
        this.currentUserSubject.next(response.user);
      }),
      catchError(error => {
        console.error('Ошибка в AuthService.login:', error);
        throw error;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  register(username: string, email: string, password: string, role: string = 'EMPLOYEE'): Observable<User> {
    // Хешируем пароль перед отправкой на сервер
    const salt = bcrypt.genSaltSync(12);
    const hashedPassword = bcrypt.hashSync(password, salt);

    return this.http.post<User>(`${this.API_URL}/register`, {
      username,
      email,
      password_hash: hashedPassword,
      role
    });
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }

  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  // Метод для проверки пароля (используется при авторизации)
  verifyPassword(password: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(password, hashedPassword);
  }

  // Метод для изменения пароля
  changePassword(userId: number, oldPassword: string, newPassword: string): Observable<boolean> {
    const salt = bcrypt.genSaltSync(12);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    return this.http.post<boolean>(`${this.API_URL}/change-password`, {
      userId,
      oldPassword,
      password_hash: hashedPassword
    });
  }
} 