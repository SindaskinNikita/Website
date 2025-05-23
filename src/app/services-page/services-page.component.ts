import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-services-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './services-page.component.html',
  styleUrls: ['./services-page.component.css']
})
export class ServicesPageComponent implements OnInit {
  isScrollButtonVisible = false;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.checkScroll();
    
    // Подписываемся на изменения фрагмента URL
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        setTimeout(() => {
          const element = document.getElementById(fragment);
          if (element) {
            element.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start'
            });
            // Добавляем класс для подсветки выбранной услуги
            element.classList.add('highlighted');
            // Убираем подсветку через 2 секунды
            setTimeout(() => {
              element.classList.remove('highlighted');
            }, 2000);
          }
        }, 100);
      }
    });
  }

  @HostListener('window:scroll', [])
  checkScroll() {
    // Показываем кнопку, когда прокрутка больше 300px
    this.isScrollButtonVisible = window.pageYOffset > 300;
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
