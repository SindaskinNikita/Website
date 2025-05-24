import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-equipment-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './equipment-page.component.html',
  styleUrl: './equipment-page.component.css'
})
export class EquipmentPageComponent {
  feedbackModalVisible = false;
  
  feedbackData = {
    name: '',
    email: '',
    phone: '',
    message: '',
    privacyAccepted: false
  };

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
