import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prismaService/prisma.service';
import { CreateUserDto, LoginUserDto } from './dto/create-user-dto';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateUser(
    loginUserDto: LoginUserDto,
  ): Promise<{ accessToken: string }> {
    const { email, password } = loginUserDto;
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = {
        username: user.username,
        email: user.email,
        userId: user.id,
      };
      const accessToken: string = this.jwtService.sign(payload);
      const { password, ...result } = user;

      return { accessToken, ...result };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  async register(createUserDto: CreateUserDto) {
    try {
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
    } catch (error) {
      const prismaErrorCode = (error as any).code;

      // Prisma prismaErrorCode === 'P2002' when violates unique properties returns error
      if (prismaErrorCode === 'P2002') {
        const target = (error as any).meta?.target;
        const field = Array.isArray(target) ? target.join(', ') : target;
        throw new ConflictException(
          `${field ?? 'Email or username'} already exists`,
        );
      }

      throw new InternalServerErrorException('Failed to register user');
    }
  }
}
