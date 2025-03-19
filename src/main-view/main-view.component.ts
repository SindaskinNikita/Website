import { Component } from '@angular/core';

@Component({
  selector: 'app-main-view',
  imports: [],
  templateUrl: './main-view.component.html',
  styleUrl: './main-view.component.css'
})
export class MainViewComponent {

  // Метод для прокрутки к форме заказа
  scrollToOrderForm() {
    const orderFormElement = document.getElementById('orderForm');
    if (orderFormElement) {
      orderFormElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
