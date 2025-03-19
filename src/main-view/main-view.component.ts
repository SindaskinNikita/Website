import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-main-view',
  imports: [],
  templateUrl: './main-view.component.html',
  styleUrl: './main-view.component.css'
})
export class MainViewComponent implements OnInit {

  showScrollButton = false;

  ngOnInit(): void {
    // ... existing code ...
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (window.scrollY > 300) {
      this.showScrollButton = true;
    } else {
      this.showScrollButton = false;
    }
  }

  // Метод для прокрутки к форме заказа
  scrollToOrderForm() {
    const orderFormElement = document.getElementById('orderForm');
    if (orderFormElement) {
      orderFormElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Метод для прокрутки наверх страницы
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
