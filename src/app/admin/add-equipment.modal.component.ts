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
        facility: '',
        status: 'active',
        lastMaintenance: new Date(),
        nextMaintenance: new Date()
    };

    ngOnInit() {
        if (this.equipmentToEdit) {
            this.equipment = { ...this.equipmentToEdit };
        }
    }

    onSubmit() {
        if (this.equipmentToEdit) {
            this.equipmentUpdated.emit(this.equipment);
        } else {
            this.equipmentAdded.emit(this.equipment);
        }
    }

    onClose() {
        this.close.emit();
    }
}
