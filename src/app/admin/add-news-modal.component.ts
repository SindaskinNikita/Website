import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { News } from '../models/news.model';

@Component({
    selector: 'app-add-news-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
        <div class="modal-overlay" (click)="onClose()">
            <div class="modal-content" [class.dark-theme]="isDarkTheme" (click)="$event.stopPropagation()">
                <div class="modal-header">
                    <h3>{{newsToEdit ? 'Редактировать новость' : 'Добавить новость'}}</h3>
                    <button class="close-btn" (click)="onClose()">&times;</button>
                </div>
                <div class="modal-body">
                    <form (ngSubmit)="onSubmit()">
                        <div class="form-group">
                            <label for="title">Заголовок</label>
                            <input type="text" id="title" [(ngModel)]="news.title" name="title" required>
                        </div>
                        <div class="form-group">
                            <label for="content">Содержание</label>
                            <textarea id="content" [(ngModel)]="news.content" name="content" rows="4" required></textarea>
                        </div>
                        <div class="form-group">
                            <label for="author">Автор</label>
                            <input type="text" id="author" [(ngModel)]="news.author" name="author" required>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" (click)="onClose()">Отмена</button>
                            <button type="submit" class="btn btn-primary">
                                {{newsToEdit ? 'Сохранить' : 'Добавить'}}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }

        .modal-content {
            background: white;
            padding: 20px;
            border-radius: 8px;
            width: 500px;
            max-width: 90%;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            box-sizing: border-box;
            transition: all 0.3s ease;
        }

        .modal-content.dark-theme {
            background: #2d2d2d;
            color: #fff;
        }

        .modal-content.dark-theme input,
        .modal-content.dark-theme textarea,
        .modal-content.dark-theme select {
            background: #3d3d3d;
            border-color: #4d4d4d;
            color: #fff;
        }

        .modal-content.dark-theme .btn-secondary {
            background: #4d4d4d;
            color: #fff;
            border-color: #5d5d5d;
        }

        .modal-content.dark-theme .btn-primary {
            background: #2e7d32;
        }

        .modal-content.dark-theme label {
            color: #ddd;
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }

        .modal-header h3 {
            margin: 0;
            color: inherit;
        }

        .close-btn {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: inherit;
        }

        .form-group {
            margin-bottom: 15px;
        }

        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: 500;
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            box-sizing: border-box;
            transition: all 0.3s ease;
        }

        .form-group textarea {
            resize: vertical;
            min-height: 100px;
        }

        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }

        .modal-footer {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #eee;
        }

        .btn {
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .btn-primary {
            background-color: #007bff;
            color: white;
            border: none;
        }

        .btn-primary:hover {
            background-color: #0056b3;
        }

        .btn-secondary {
            background-color: #6c757d;
            color: white;
            border: none;
        }

        .btn-secondary:hover {
            background-color: #5a6268;
        }
    `]
})
export class AddNewsModalComponent implements OnInit {
    @Input() newsToEdit: News | null = null;
    @Input() isDarkTheme: boolean = false;
    @Output() close = new EventEmitter<void>();
    @Output() newsAdded = new EventEmitter<News>();
    @Output() newsUpdated = new EventEmitter<News>();

    news: News = {
        id: 0,
        title: '',
        content: '',
        author: '',
        date: new Date()
    };

    ngOnInit() {
        if (this.newsToEdit) {
            this.news = { ...this.newsToEdit };
        }
    }

    onSubmit() {
        if (this.newsToEdit) {
            this.newsUpdated.emit(this.news);
        } else {
            this.newsAdded.emit(this.news);
        }
    }

    onClose() {
        this.close.emit();
    }
}
