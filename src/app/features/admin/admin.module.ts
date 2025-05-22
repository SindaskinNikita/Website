import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminComponent } from './admin.component';
import { AddEmployeeModalComponent } from './components/add-employee-modal/add-employee-modal.component';
import { AddFacilityModalComponent } from './components/add-facility-modal/add-facility-modal.component';
import { AddNewsModalComponent } from './components/add-news-modal/add-news-modal.component';
import { AddEquipmentModalComponent } from './components/add-equipment-modal/add-equipment-modal.component';

@NgModule({
    declarations: [
        AdminComponent,
        AddEmployeeModalComponent,
        AddFacilityModalComponent,
        AddNewsModalComponent,
        AddEquipmentModalComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule
    ],
    exports: [
        AdminComponent
    ]
})
export class AdminModule { } 