import { Body, Controller, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { changeDTO, checkShortTokenDTO, getKeyDTO, getUserInfoDTO, registrationDTO, resetPasswordDTO, updateShortTokenDTO } from './DTOs';

@Controller() // Create module controller
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Sign in users, adds them into db
  @Post("registration")
  @HttpCode(201)
  @UsePipes(new ValidationPipe())
  async registrate(@Body() dto: registrationDTO) {
    return this.appService.registrate(dto);
  }

  // If user's credentials are right, will return long token to log them
  @Post("authentication")
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async authenticate(@Body() dto: registrationDTO) {
    return this.appService.authenticate(dto);
  }

  // Updates short token with long token
  @Post("update")
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async updateShortToken(@Body() dto: updateShortTokenDTO) {
    return this.appService.updateShortToken(dto);
  }

  // Check's valid of short token
  @Post("check")
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async checkShortToken(@Body() dto: checkShortTokenDTO) {
    return this.appService.checkShortToken(dto);
  }

  // Changes user info by password (or short token if user wants reset his password)
  @Post("change")
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async changeUserInfo(@Body() dto: changeDTO) {
    return this.appService.changeUserInfo(dto);
  }

  // Returns user info by short token
  @Post("getinfo")
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async getUserInfo(@Body() dto: getUserInfoDTO) {
    return this.appService.getUserInfo(dto);
  }

  // Returns user's crypt key 
  @Post("getkey")
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async getKey(@Body() dto: getKeyDTO) {
    return this.appService.getKey(dto);
  }

  // Sends url with short token in query string to change password
  @Post("resetpassword")
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async resetPassword(@Body() dto: resetPasswordDTO) {
    return this.appService.sendMailToResetPassword(dto);
  }

}
