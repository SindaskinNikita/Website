import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EquipmentService } from '../services/equipment.service';
import { Equipment } from '../models/equipment.model';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-equipment-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './equipment-page.component.html',
  styleUrl: './equipment-page.component.css'
})
export class EquipmentPageComponent implements OnInit, OnDestroy {
  feedbackModalVisible = false;
  equipment: Equipment[] = [];
  filteredEquipment: Equipment[] = [];
  categories: string[] = [];
  selectedCategory = 'Все';
  searchQuery = '';
  
  private destroy$ = new Subject<void>();
  
  feedbackData = {
    name: '',
    email: '',
    phone: '',
    message: '',
    privacyAccepted: false
  };

  constructor(private equipmentService: EquipmentService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.subscribeToEquipmentData();
    this.filteredEquipment = this.equipment;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCategories(): void {
    this.categories = this.equipmentService.getCategories();
  }

  private subscribeToEquipmentData(): void {
    this.equipmentService.getEquipment()
      .pipe(takeUntil(this.destroy$))
      .subscribe((equipment) => {
        this.equipment = equipment;
        this.filterEquipment();
      });

    this.equipmentService.getSelectedCategory()
      .pipe(takeUntil(this.destroy$))
      .subscribe((category) => {
        this.selectedCategory = category;
        this.filterEquipment();
      });

    this.equipmentService.getSearchQuery()
      .pipe(takeUntil(this.destroy$))
      .subscribe((query) => {
        this.searchQuery = query;
        this.filterEquipment();
      });
  }

  private filterEquipment(): void {
    let filtered = [...this.equipment];

    // Фильтр по категории
    if (this.selectedCategory !== 'Все') {
      filtered = filtered.filter(item => item.category === this.selectedCategory);
    }

    // Фильтр по поисковому запросу
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.features.some(feature => feature.toLowerCase().includes(query))
      );
    }

    this.filteredEquipment = filtered;
  }

  onCategorySelect(category: string): void {
    this.selectedCategory = category;
    this.equipmentService.setSelectedCategory(category);
  }

  onSearch(): void {
    this.equipmentService.setSearchQuery(this.searchQuery);
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'assets/images/camera.jpg';
    }
  }

  openFeedbackModal(): void {
    this.feedbackModalVisible = true;
  }

  closeFeedbackModal(): void {
    this.feedbackModalVisible = false;
  }

  submitFeedback(): void {
    if (this.feedbackData.name && this.feedbackData.email && this.feedbackData.message && this.feedbackData.privacyAccepted) {
      // Здесь можно добавить логику отправки данных на сервер
      console.log('Отправка сообщения:', this.feedbackData);
      
      // Очищаем форму
      this.feedbackData = {
        name: '',
        email: '',
        phone: '',
        message: '',
        privacyAccepted: false
      };

      this.closeFeedbackModal();
      alert('Ваше сообщение успешно отправлено!');
    }
  }
}
