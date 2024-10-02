import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Employee, EmployeeDocument } from './schemas/employee.schema';
import { LoggingService } from 'src/logging/logging.service';
import { MetricsService } from 'src/metrics/metrics.service';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(Employee.name)
    private employeeModel: Model<EmployeeDocument>,
    private readonly logger: LoggingService,
    private readonly metricsService: MetricsService,
  ) {}

  async create(createEmployeeDto: any): Promise<Employee> {
    this.logger.log('Creating a new employee', 'EmployeeService');
    const createdEmployee = new this.employeeModel(createEmployeeDto);
    try {
      const result = await createdEmployee.save();
      this.logger.log(`Employee created with ID: ${result.id}`, 'EmployeeService');
      this.metricsService.incrementRequestCount();
      return result;
    } catch (error) {
      this.logger.error('Error creating employee', error.stack, 'EmployeeService');
      this.metricsService.incrementErrorCount();
      throw error;
    }
  }

  async findAll(): Promise<Employee[]> {
    this.logger.log('Fetching all employees', 'EmployeeService');
    try {
      const employees = await this.employeeModel.find().exec();
      this.logger.log(`Fetched ${employees.length} employees`, 'EmployeeService');
      this.metricsService.incrementRequestCount();
      return employees;
    } catch (error) {
      this.logger.error('Error fetching employees', error.stack, 'EmployeeService');
      this.metricsService.incrementErrorCount();
      throw error;
    }
  }

  async findOne(id: string): Promise<Employee> {
    this.logger.log(`Fetching employee with ID: ${id}`, 'EmployeeService');
    try {
      const employee = await this.employeeModel.findById(id).exec();
      if (employee) {
        this.logger.log(`Employee found with ID: ${id}`, 'EmployeeService');
      } else {
        this.logger.warn(`Employee not found with ID: ${id}`, 'EmployeeService');
      }
      this.metricsService.incrementRequestCount();
      return employee;
    } catch (error) {
      this.logger.error(`Error fetching employee with ID: ${id}`, error.stack, 'EmployeeService');
      this.metricsService.incrementErrorCount();
      throw error;
    }
  }

  async update(id: string, updateEmployeeDto: any): Promise<Employee> {
    this.logger.log(`Updating employee with ID: ${id}`, 'EmployeeService');
    try {
      const updatedEmployee = await this.employeeModel.findByIdAndUpdate(id, updateEmployeeDto, {
        new: true,
      }).exec();
      if (updatedEmployee) {
        this.logger.log(`Employee updated with ID: ${id}`, 'EmployeeService');
      } else {
        this.logger.warn(`Employee not found for update with ID: ${id}`, 'EmployeeService');
      }
      this.metricsService.incrementRequestCount();
      return updatedEmployee;
    } catch (error) {
      this.logger.error(`Error updating employee with ID: ${id}`, error.stack, 'EmployeeService');
      this.metricsService.incrementErrorCount();
      throw error;
    }
  }

  async delete(id: string): Promise<any> {
    this.logger.log(`Deleting employee with ID: ${id}`, 'EmployeeService');
    try {
      const result = await this.employeeModel.findByIdAndDelete(id).exec();
      if (result) {
        this.logger.log(`Employee deleted with ID: ${id}`, 'EmployeeService');
      } else {
        this.logger.warn(`Employee not found for deletion with ID: ${id}`, 'EmployeeService');
      }
      this.metricsService.incrementRequestCount();
      return result;
    } catch (error) {
      this.logger.error(`Error deleting employee with ID: ${id}`, error.stack, 'EmployeeService');
      this.metricsService.incrementErrorCount();
      throw error;
    }
  }
}
