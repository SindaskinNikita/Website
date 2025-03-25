import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-company-page',
  imports: [],
  templateUrl: './company-page.component.html',
  styleUrl: './company-page.component.css'
})
export class CompanyPageComponent implements OnInit {

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
        toggleButton.innerHTML = '<span class="toggle-icon">−</span> Свернуть';
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
        toggleButton.innerHTML = '<span class="toggle-icon">+</span> Развернуть все';
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

}
