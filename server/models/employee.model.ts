import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
    name: String,
    position: String,
    location: String,
    status: {
        type: String,
        enum: ['active', 'inactive', 'warning'],
        default: 'active'
    }
});

export const Employee = mongoose.model('Employee', EmployeeSchema); 