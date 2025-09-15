import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user-dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //   @Post('login')
  //   async login(@Body() createUserDto: CreateUserDto) {
  //     return this.authService.login(createUserDto);
  //   }

  @Post('login')
  async login(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.validateUser(createUserDto);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('test')
  @UseGuards(AuthGuard())
  test(@Req() req: any) {
    console.log(req);
  }
}
