import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService, UserRole } from '../auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authService: AuthService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const currentUser = this.authService.currentUserValue;
        
        if (!currentUser) {
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            return false;
        }

        // Проверяем роли, если они указаны в route.data
        if (route.data?.roles && !this.checkRoles(currentUser.role, route.data.roles)) {
            this.router.navigate(['/forbidden']);
            return false;
        }

        return true;
    }

    private checkRoles(userRole: UserRole, allowedRoles: UserRole[]): boolean {
        return allowedRoles.includes(userRole);
    }
} 