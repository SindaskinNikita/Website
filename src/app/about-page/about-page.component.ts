import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Review {
  name: string;
  email: string;
  text: string;
  date: Date;
}

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.css'
})
export class AboutPageComponent {
  public modalVisible = false;
  public reviews: Review[] = [
    { 
      name: 'Иван Петров', 
      email: 'ivan@example.com', 
      text: 'Отличный сервис! Установили систему видеонаблюдения быстро и качественно. Теперь чувствую себя в безопасности.', 
      date: new Date('2023-05-15') 
    },
    { 
      name: 'Анна Сидорова', 
      email: 'anna@example.com', 
      text: 'Спасибо за профессиональный подход. Бригада приехала вовремя, всё установили аккуратно и дали подробные рекомендации по использованию.', 
      date: new Date('2023-06-20') 
    },
    { 
      name: 'Дмитрий Кузнецов', 
      email: 'dmitriy@example.com', 
      text: 'Заказывал установку охранной системы. Ребята сработали на отлично! Всё функционирует как часы, рекомендую!', 
      date: new Date('2023-07-10') 
    }
  ];
  public newReview: Review = { name: '', email: '', text: '', date: new Date() };

  public feedbackModalVisible = false;
  public feedbackData = {
    name: '',
    email: '',
    phone: '',
    message: ''
  };

  openModal(): void {
    this.modalVisible = true;
  }

  closeModal(): void {
    this.modalVisible = false;
  }

  submitReview(): void {
    this.reviews.unshift({...this.newReview, date: new Date()});
    this.newReview = { name: '', email: '', text: '', date: new Date() };
    this.closeModal();
  }

  openFeedbackModal(): void {
    this.feedbackModalVisible = true;
  }

  closeFeedbackModal(): void {
    this.feedbackModalVisible = false;
  }

  submitFeedback(): void {
    console.log('Отправка сообщения:', this.feedbackData);
    
    this.feedbackData = {
      name: '',
      email: '',
      phone: '',
      message: ''
    };
    
    this.closeFeedbackModal();
    
    alert('Ваше сообщение успешно отправлено!');
  }
}
