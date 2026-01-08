/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { Auth } from './auth.schema';
import { AuthService } from './auth.service';
import { Request } from 'express';
// import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Req() request: Request) {
    // console.log('request', request.body);
    const result = await this.authService.signup(request.body);
    return result;
  }

  @Post('signin')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const res = await this.authService.signin(email, password);
    return res;
  }

  @Post('forgetPassword')
  async forgetPassword(@Body('email') email: string) {
    const result = await this.authService.forgetPassword(email.toLowerCase());
    return result;
  }

  @Post('updatePassword')
  async updatePassword(
    @Body('email') email: string,
    // @Body('password') password: string,
    @Body('newPassword') newPassword: string,
  ) {
    const result = await this.authService.updatePassword(
      email.toLowerCase(),
      newPassword,
    );
    return result;
  }

  @Post('resetPassword')
  async resetPassword(
    @Body('email') email: string,
    @Body('newPassword') password: string,
  ) {
    const result = await this.authService.resetPassword(
      email.toLowerCase(),
      password,
    );
    return result;
  }

  @Patch('updateUserData')
  // @UseInterceptors(FileInterceptor('file'))
  async editProfile(
    @Body('userId') userId: String,
    @Body('userData') userData,
  ) {
    const result = await this.authService.editProfile(userId, userData);
    return result;
  }

  @Get('/getAllUsers')
  async getAllUsers() {
    const result = await this.authService.getAllUsers();
    return result;
  }

  @Delete('/deleteUser/:id')
  async deleteUser(@Param('id') userId: string) {
    const result = await this.authService.deleteUser(userId);
    return result;
  }
}
