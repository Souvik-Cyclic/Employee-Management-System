import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Employee, EmployeeDocument } from './schemas/employee.schema';

@Injectable()
export class EmployeeService {
    constructor(
        @InjectModel(Employee.name)
        private employeeModel: Model<EmployeeDocument>
    ) {}

    async create(createEmployeeDto: any): Promise<Employee> {
        const createdEmployee = new this.employeeModel(createEmployeeDto);
        return createdEmployee.save();
    }

    async findAll(): Promise<Employee[]> {
        return this.employeeModel.find().exec();
    }

    async findOne(id: string): Promise<Employee> {
        return this.employeeModel.findById(id).exec();
    }

    async update(id: string, updateEmployeeDto: any): Promise<Employee> {
        return this.employeeModel.findByIdAndUpdate(id, updateEmployeeDto, {
            new: true,
        }).exec();
    }

    async delete(id: string): Promise<any> {
        return this.employeeModel.findByIdAndDelete(id).exec();
    }
}
