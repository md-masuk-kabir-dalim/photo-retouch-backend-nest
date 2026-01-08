/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { EmployeeService } from './employee.service';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  async createEmployee(@Req() req: Request) {
    console.log('req.body', req.body);
    return await this.employeeService.createEmployee(req.body);
  }

  @Get('/getEmployee/:id')
  async getEmployee(@Param('id') employeeId: string) {
    const result = await this.employeeService.getEmployee(employeeId);
    return result;
  }

  @Patch('updateEmployee')
  async updateEmployee(
    @Body('id') employeeId: String,
    @Body('employeeData') employeeData,
  ) {
    const result = await this.employeeService.updateEmployee(
      employeeId,
      employeeData,
    );
    return result;
  }

  @Delete('/deleteEmployee/:id')
  async deleteEmployee(@Param('id') employeeId: string) {
    return await this.employeeService.deleteEmployee(employeeId);
  }

  @Get('/getAllEmployeesOfShop/:id')
  async getAllEmployeesOfShop(@Param('id') shopId: string) {
    const result = await this.employeeService.getAllEmployeesOfShop(shopId);
    return result;
  }
}
