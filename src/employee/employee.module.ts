import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Employee, EmployeeSchema } from './schemas/employee.schema';
import { LoggingModule } from 'src/logging/logging.module';
import { MetricsModule } from 'src/metrics/metrics.module';

@Module({
  imports: [
    LoggingModule, 
    MetricsModule,
    MongooseModule.forFeature([{name: Employee.name, schema: EmployeeSchema}])],
  controllers: [EmployeeController],
  providers: [EmployeeService],
})
export class EmployeeModule {}
