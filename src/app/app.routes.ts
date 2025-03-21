import { Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { MainViewComponent } from '../main-view/main-view.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { ServicesPageComponent } from './services-page/services-page.component';
import { CompanyPageComponent } from './company-page/company-page.component';
import { ContactsPageComponent } from './contacts-page/contacts-page.component';
import { EquipmentPageComponent } from './equipment-page/equipment-page.component';

export const routes: Routes = [
    { path: '', redirectTo: '/admin', pathMatch: 'full' },
    { path: 'admin', component: AdminComponent },
    { path: 'admin/employees', component: AdminComponent },
    { path: 'admin/facilities', component: AdminComponent },
    { path: 'admin/reports', component: AdminComponent },
    { path: 'admin/settings', component: AdminComponent },
    { path: 'main-view', component: MainViewComponent },
    { path: 'about-page', component: AboutPageComponent },
    { path: 'services-page', component: ServicesPageComponent },
    { path: 'company-page', component: CompanyPageComponent },
    { path: 'contacts-page', component: ContactsPageComponent },
    { path: 'equipment-page', component: EquipmentPageComponent }
];
