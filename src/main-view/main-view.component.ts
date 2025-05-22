import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-view.component.html',
  styleUrl: './main-view.component.css'
})
export class MainViewComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('portfolioSlider') portfolioSlider!: ElementRef;

  // Массив элементов портфолио
  portfolioItems = [
    {
      image: 'assets/portfolio/project1.jpg',
      title: 'Умное зеркало',
      description: 'Установка подсветки для зеркала в квартире'
    },
    {
      image: 'assets/portfolio/project2.jpg',
      title: 'Система контроля и управлением доступа',
      description: 'Полная автоматизация частного дома с интеграцией систем безопасности и видеонаблюдения'
    },
    {
      image: 'assets/portfolio/project3.jpg',
      title: 'Система контроля и управлением доступа',
      description: 'Полная автоматизация частного дома с интеграцией систем безопасности и видеонаблюдения'
    },
    {
      image: 'assets/portfolio/project4.jpg',
      title: 'Монтаж встроеной подсветки',
      description: 'Установка встроенной подсветки на сцене '
    },
    {
      image: 'assets/portfolio/project5.jpg',
      title: 'Монтаж встроеной подсветки',
      description: 'Установка встроенной подсветки на сцене '
    },
    {
      image: 'assets/portfolio/project6.jpg',
      title: 'Устоновка стеклянного потолка со светильниками',
      description: 'Комплексное оснащение учебного заведения системами безопасности и контроля'
    },
    {
      image: 'assets/portfolio/project7.jpg',
      title: 'Устоновка стеклянного потолка со светильниками',
      description: 'Комплексное оснащение учебного заведения системами безопасности и контроля'
    },
    {
      image: 'assets/portfolio/project8.jpg',
      title: 'Защищённый монтажный щиток для систем видеонаблюдения',
      description: 'Защищённый монтажный щиток для систем видеонаблюдения, обеспечивающий безопасное хранение и организованное размещение оборудования'
    },
    {
      image: 'assets/portfolio/project9.jpg',
      title: 'Защищённый монтажный щиток для систем видеонаблюдения',
      description: 'Профессиональный коммутационный ящик, в котором размещается сетевое и записывающее оборудование для систем безопасности'
    },
    {
      image: 'assets/portfolio/project10.jpg',
      title: 'Защищённый монтажный щиток для систем видеонаблюдения',
      description: 'Это технический шкаф (кросс-бокс), используемый для компактного и защищённого хранения устройств, связанных с работой камер видеонаблюдения'
    },
    {
      image: 'assets/portfolio/project11.jpg',
      title: 'Система видеонаблюдения',
      description: 'Система видеонаблюдения, которая обеспечивает контроль и мониторинг объекта'
    },
    {
      image: 'assets/portfolio/project12.jpg',
      title: 'Система видеонаблюдения',
      description: 'Система видеонаблюдения, которая обеспечивает контроль и мониторинг объекта'
    },
    {
      image: 'assets/portfolio/project13.jpg',
      title: 'Система контроля и управлением доступа',
      description: 'Установка систем контроля доступа в частном доме'
    },
    {
      image: 'assets/portfolio/project14.jpg',
      title: 'Монтаж встроенной подсветки',
      description: 'Монтаж встроенной подсветки потолка в квартире'
    },
    {
      image: 'assets/portfolio/project15.jpg',
      title: 'Монтаж встроенной подсветки',
      description: 'Монтаж встроенной подсветки контура комнаты в квартире '
    },
    {
      image: 'assets/portfolio/project16.jpg',
      title: 'Тёплый пол',
      description: 'Установка системы теплого пола в квартире'
    },
    {
      image: 'assets/portfolio/project17.jpg',
      title: 'Монтаж встроенной подсветки',
      description: 'Профессиональный монтаж скрытой LED-подсветки для тумб под раковину'
    },
    {
      image: 'assets/portfolio/project18.jpg',
      title: 'Электро щиток',
      description: 'Аккуратно собранный электрощит — чистая компоновка и профессиональный монтаж'
    },
    {
      image: 'assets/portfolio/project19.jpg',
      title: 'Видео наблюдение',
      description: 'Чистый монтаж камер: ни лишних проводов, ни слепых зон'
    },
    {
      image: 'assets/portfolio/project20.jpg',
      title: 'Монтаж встроенной подсветки',
      description: 'Профессиональный монтаж скрытой LED-подсветки'
    },
    {
      image: 'assets/portfolio/project21.jpg',
      title: 'Монтаж встроенной подсветк',
      description: 'Профессиональный монтаж скрытой LED-подсветки в сауне'
    }
  ];

  private isDragging = false;
  private startX = 0;
  private scrollLeft = 0;
  private currentIndex = 0;
  private autoScrollInterval: any;

  constructor() { }

  ngOnInit(): void {
    // Инициализация, если необходимо
  }

  ngAfterViewInit(): void {
    if (this.portfolioSlider) {
      // Запуск автоматической прокрутки
      this.startAutoScroll();
    }
  }

  ngOnDestroy(): void {
    // Очистка интервала при уничтожении компонента
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
    }
  }

  private startAutoScroll(): void {
    this.autoScrollInterval = setInterval(() => {
      if (!this.isDragging) {
        this.slideNext();
      }
    }, 5000);
  }

  slidePrev(): void {
    if (this.isDragging) return;
    
    const track = this.portfolioSlider.nativeElement;
    const items = track.getElementsByClassName('portfolio-item');
    
    this.currentIndex = Math.max(0, this.currentIndex - 1);
    if (this.currentIndex === 0) {
      this.currentIndex = items.length - 1;
    }
    
    this.scrollToIndex(this.currentIndex);
  }

  slideNext(): void {
    if (this.isDragging) return;
    
    const track = this.portfolioSlider.nativeElement;
    const items = track.getElementsByClassName('portfolio-item');
    
    this.currentIndex = (this.currentIndex + 1) % items.length;
    this.scrollToIndex(this.currentIndex);
  }

  private scrollToIndex(index: number): void {
    const track = this.portfolioSlider.nativeElement;
    const items = track.getElementsByClassName('portfolio-item');
    if (items.length === 0) return;
    
    const itemWidth = items[0].offsetWidth + 20; // 20px это gap между элементами
    track.style.transform = `translateX(-${index * itemWidth}px)`;
  }

  startDragging(event: MouseEvent | TouchEvent): void {
    this.isDragging = true;
    const track = this.portfolioSlider.nativeElement;
    
    // Получаем текущую позицию transform
    const style = window.getComputedStyle(track);
    const matrix = new WebKitCSSMatrix(style.transform);
    this.scrollLeft = matrix.m41; // m41 содержит значение translateX
    
    if (event instanceof MouseEvent) {
      this.startX = event.pageX;
    } else {
      this.startX = event.touches[0].pageX;
    }
    
    // Отключаем transition во время перетаскивания
    track.style.transition = 'none';
  }

  onDragging(event: MouseEvent | TouchEvent): void {
    if (!this.isDragging) return;
    event.preventDefault();
    
    const track = this.portfolioSlider.nativeElement;
    const currentX = event instanceof MouseEvent ? event.pageX : event.touches[0].pageX;
    const diff = currentX - this.startX;
    
    track.style.transform = `translateX(${this.scrollLeft + diff}px)`;
  }

  stopDragging(): void {
    if (!this.isDragging) return;
    this.isDragging = false;
    
    const track = this.portfolioSlider.nativeElement;
    const items = track.getElementsByClassName('portfolio-item');
    const itemWidth = items[0].offsetWidth + 20;
    
    // Возвращаем transition
    track.style.transition = 'transform 0.5s ease';
    
    // Определяем ближайший индекс
    const style = window.getComputedStyle(track);
    const matrix = new WebKitCSSMatrix(style.transform);
    const currentPosition = matrix.m41;
    
    this.currentIndex = Math.round(Math.abs(currentPosition) / itemWidth);
    this.currentIndex = Math.max(0, Math.min(this.currentIndex, items.length - 1));
    
    this.scrollToIndex(this.currentIndex);
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
