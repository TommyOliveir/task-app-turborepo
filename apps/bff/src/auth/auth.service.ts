import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prismaService/prisma.service';
import { CreateUserDto } from './dto/create-user-dto';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateUser(
    createUserDto: CreateUserDto,
  ): Promise<{ accessToken: string }> {
    const { email, password } = createUserDto;
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = {
        username: user.username,
        email: user.email,
        userId: user.id,
      };
      const accessToken: string = this.jwtService.sign(payload);
      // const { password, ...result } = user;

      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  async register(createUserDto: CreateUserDto) {
    const { username, email, password } = createUserDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await this.prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    const { password: _password, ...dataWithoutPassword } = user;

    return dataWithoutPassword;
  }
}
