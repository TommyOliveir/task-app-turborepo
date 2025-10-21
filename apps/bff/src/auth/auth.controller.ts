import { redirect } from 'next/navigation';
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto/create-user-dto';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authService.googleLogin(req);
    console.log('req.user:', req.user);

    if (typeof data === 'string' || !data.user) {
      res.status(400).send('No user data');
      return;
    }

    const accessToken = data.accessToken;
    const userGoogle = data.user.username;
    const userGoogleStr = encodeURIComponent(JSON.stringify(userGoogle));

    //mocking to have data in UI
    res.redirect(
      `http://localhost:3001/profile?token=${accessToken}&userGoogle=${userGoogleStr}`,
    );
  }

  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.validateUser(loginUserDto);
  }

  @Post('signup')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
  @Post('test')
  @UseGuards(AuthGuard())
  test(@Req() req: any) {
    console.log(req.body);
  }
}
