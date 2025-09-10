import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prismaService/prisma.service';
import { CreateUserDto } from './dto/create-user-dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateUser(createUserDto: CreateUserDto): Promise<any> {
    const { email, password } = createUserDto;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { email: user.email, sub: user.id };
      const accessToken: string = this.jwtService.sign(payload);
      const { password, ...result } = user;

      return accessToken;
    }
    return null;
  }

  //   async login(user: any) {
  //     const payload = { email: user.email, sub: user.id };
  //     return {
  //       access_token: this.jwtService.sign(payload),
  //     };
  //   }

  async register(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    const { password: _password, ...dataWithoutPassword } = user;
    return dataWithoutPassword;
  }
}
