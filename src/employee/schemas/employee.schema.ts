import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmployeeDocument = Employee & Document;

@Schema()
export class Employee {
  @Prop({ required: true })
  name: string;

  @Prop()
  position: string;

  @Prop()
  salary: number;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);