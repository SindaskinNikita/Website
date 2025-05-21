import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-company-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './company-page.component.html',
  styleUrls: ['./company-page.component.css']
})
export class CompanyPageComponent implements OnInit {
  isFeedbackModalOpen = false;
  feedbackForm = {
    name: '',
    phone: '',
    message: ''
  };

  constructor() { }

  ngOnInit(): void {
    // Добавляем функцию сворачивания/разворачивания видов деятельности в глобальный объект window
    (window as any).toggleActivities = this.toggleActivities;
  }

  // Метод для прокрутки наверх страницы
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Функция для сворачивания/разворачивания списка видов деятельности
  toggleActivities(): void {
    const activitiesList = document.getElementById('activitiesList');
    const toggleButton = document.querySelector('.toggle-button');
    const toggleIcon = document.querySelector('.toggle-icon');
    const activitiesNote = document.querySelector('.activities-note');
    
    if (activitiesList && toggleButton && toggleIcon && activitiesNote) {
      if (activitiesList.classList.contains('collapsed')) {
        // Разворачиваем список
        activitiesList.classList.remove('collapsed');
        activitiesList.classList.add('expanded');
        toggleIcon.textContent = '−';
        toggleButton.innerHTML = '<span class="toggle-icon"></span> Свернуть';
        activitiesNote.textContent = 'Показаны все виды деятельности. Нажмите "Свернуть" для скрытия.';
        
        // Плавная прокрутка к нижней части списка (опционально)
        setTimeout(() => {
          activitiesNote.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        // Сворачиваем список
        activitiesList.classList.remove('expanded');
        activitiesList.classList.add('collapsed');
        toggleIcon.textContent = '+';
        toggleButton.innerHTML = '<span class="toggle-icon"></span> Развернуть';
        activitiesNote.textContent = 'Показано 100+ видов деятельности. Нажмите "Развернуть все" для просмотра полного списка.';
        
        // Прокрутка к началу списка (опционально)
        setTimeout(() => {
          const activityHeader = document.querySelector('.activity-header');
          if (activityHeader) {
            activityHeader.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    }
  }

  openFeedbackModal() {
    this.isFeedbackModalOpen = true;
  }

  closeFeedbackModal() {
    this.isFeedbackModalOpen = false;
    this.resetForm();
  }

  resetForm() {
    this.feedbackForm = {
      name: '',
      phone: '',
      message: ''
    };
  }

  submitFeedback() {
    // Здесь будет логика отправки формы
    console.log('Отправка формы:', this.feedbackForm);
    this.closeFeedbackModal();
  }
}
