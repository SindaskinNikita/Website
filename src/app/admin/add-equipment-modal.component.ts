import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Equipment } from '../models/equipment.model';

@Component({
    selector: 'app-add-equipment-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './add-equipment-modal.component.html',
    styleUrls: ['./add-equipment-modal.component.css']
})
export class AddEquipmentModalComponent implements OnInit {
    @Input() equipmentToEdit: Equipment | null = null;
    @Input() isDarkTheme: boolean = false;
    @Output() close = new EventEmitter<void>();
    @Output() equipmentAdded = new EventEmitter<Equipment>();
    @Output() equipmentUpdated = new EventEmitter<Equipment>();

    equipment: Partial<Equipment> = {
        name: '',
        type: '',
        category: '',
        facility: '',
        location: '',
        status: 'active',
        lastMaintenance: new Date(),
        nextMaintenance: new Date(),
        description: '',
        features: [],
        image: '',
        price: 0
    };

    categories: string[] = [
        'Медицинское оборудование',
        'Лабораторное оборудование',
        'Диагностическое оборудование',
        'Хирургическое оборудование',
        'Реабилитационное оборудование'
    ];

    statuses: Array<'active' | 'inactive' | 'maintenance'> = ['active', 'inactive', 'maintenance'];

    ngOnInit(): void {
        if (this.equipmentToEdit) {
            this.equipment = {
                ...this.equipmentToEdit,
                lastMaintenance: new Date(this.equipmentToEdit.lastMaintenance),
                nextMaintenance: new Date(this.equipmentToEdit.nextMaintenance)
            };
        }
    }

    onSubmit(): void {
        if (this.equipmentToEdit) {
            this.equipmentUpdated.emit({
                ...this.equipmentToEdit,
                ...this.equipment
            } as Equipment);
        } else {
            const newEquipment: Equipment = {
                id: Date.now(), // Временный ID, должен генерироваться на сервере
                name: this.equipment.name || '',
                type: this.equipment.type || '',
                category: this.equipment.category || '',
                facility: this.equipment.facility || '',
                location: this.equipment.location || '',
                status: this.equipment.status || 'active',
                lastMaintenance: this.equipment.lastMaintenance || new Date(),
                nextMaintenance: this.equipment.nextMaintenance || new Date(),
                description: this.equipment.description || '',
                features: this.equipment.features || [],
                image: this.equipment.image || '',
                price: this.equipment.price || 0
            };
            this.equipmentAdded.emit(newEquipment);
        }
        this.onClose();
    }

    onClose(): void {
        this.close.emit();
    }

    addFeature(): void {
        const feature = prompt('Введите характеристику оборудования:');
        if (feature && feature.trim()) {
            if (!this.equipment.features) {
                this.equipment.features = [];
            }
            this.equipment.features = [...this.equipment.features, feature.trim()];
        }
    }

    removeFeature(index: number): void {
        if (this.equipment.features) {
            this.equipment.features = this.equipment.features.filter((_, i) => i !== index);
        }
    }
} 