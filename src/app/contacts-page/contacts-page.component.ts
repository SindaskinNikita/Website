import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contacts-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contacts-page.component.html',
  styleUrls: ['./contacts-page.component.css']
})
export class ContactsPageComponent implements OnInit {
  isFeedbackModalOpen = false;
  feedbackForm = {
    name: '',
    phone: '',
    message: ''
  };
  isScrollButtonVisible = false;

  constructor() { }

  ngOnInit(): void {
    this.checkScroll();
  }

  @HostListener('window:scroll', [])
  checkScroll() {
    // Показываем кнопку, когда прокрутка больше 300px
    this.isScrollButtonVisible = window.pageYOffset > 300;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
