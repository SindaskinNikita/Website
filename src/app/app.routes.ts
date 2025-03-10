import { Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { MainViewComponent } from '../main-view/main-view.component';

export const routes: Routes = [
    { path: 'admin', component: AdminComponent },
    { path: '', component: MainViewComponent}
];
