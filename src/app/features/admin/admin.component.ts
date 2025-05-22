import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { EmployeeService } from '../../core/services/employee.service';
import { FacilityService } from '../../core/services/facility.service';
import { AuthService, UserRole } from '../../core/auth/auth.service';
import { Employee } from '../../shared/models/employee.model';
import { Facility } from '../../shared/models/facility.model';

import { AddEmployeeModalComponent } from './components/add-employee-modal/add-employee-modal.component';
import { AddFacilityModalComponent } from './components/add-facility-modal/add-facility-modal.component';
import { AddNewsModalComponent } from './components/add-news-modal/add-news-modal.component';
import { AddEquipmentModalComponent } from './components/add-equipment-modal/add-equipment-modal.component';

// Остальной код компонента AdminComponent остается без изменений
// ... existing code ... 