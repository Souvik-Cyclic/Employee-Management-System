import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmployeeDocument = Employee & Document;

@Schema()
export class Employee {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  position: string;

  @Prop({ type: Number})
  salary: number;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);