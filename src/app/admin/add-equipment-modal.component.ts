import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Equipment } from '../models/equipment.model';

@Component({
    selector: 'app-add-equipment-modal',
    templateUrl: './add-equipment-modal.component.html',
    styleUrls: ['./add-equipment-modal.component.css'],
    standalone: true,
    imports: [CommonModule, FormsModule]
})
export class AddEquipmentModalComponent implements OnInit {
    @Input() equipmentToEdit: Equipment | null = null;
    @Output() close = new EventEmitter<void>();
    @Output() equipmentAdded = new EventEmitter<Equipment>();
    @Output() equipmentUpdated = new EventEmitter<Equipment>();

    equipment: Equipment = {
        id: 0,
        name: '',
        type: '',
        category: '',
        facility: '',
        status: 'active',
        lastMaintenance: new Date(),
        nextMaintenance: new Date(),
        features: [],
        description: '',
        image: '',
        price: 0
    };

    categories: string[] = ['Камеры', 'Серверы', 'Сетевое оборудование', 'Системы безопасности'];
    statuses: ('active' | 'inactive' | 'maintenance')[] = ['active', 'inactive', 'maintenance'];

    ngOnInit() {
        if (this.equipmentToEdit) {
            this.equipment = { ...this.equipmentToEdit };
        }
    }

    onSubmit() {
        if (this.equipmentToEdit) {
            this.equipmentUpdated.emit(this.equipment);
        } else {
            // При создании нового оборудования не отправляем id
            const { id, ...newEquipment } = this.equipment;
            this.equipmentAdded.emit(newEquipment as Equipment);
        }
    }

    onClose() {
        this.close.emit();
    }

    addFeature() {
        const feature = prompt('Введите характеристику оборудования:');
        if (feature) {
            this.equipment.features = [...this.equipment.features, feature];
        }
    }

    removeFeature(index: number) {
        this.equipment.features = this.equipment.features.filter((_, i) => i !== index);
    }
} 