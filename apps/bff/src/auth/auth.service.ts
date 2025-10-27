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
import { IAuthenticatedRequest } from 'src/types/IAuthenticatedRequest';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async googleLogin(req: IAuthenticatedRequest) {
    if (!req.user) {
      return 'No user from google';
    }

    const googleUser = req.user;

    let user = await this.prisma.user.findUnique({
      where: { email: googleUser.email },
    });

    const username =
      googleUser.firstName ?? googleUser.username ?? 'Google User';

    // If user doesn't exist, create new one
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: googleUser.email!,
          username,
        },
      });
    }

    // Prepare consistent JWT payload
    const payload = {
      username: user.username,
      userId: user.id,
      email: user.email,
    };

    const jwtToken = this.jwtService.sign(payload);

    return {
      user,
      accessToken: jwtToken,
    };
  }

  async login(loginUserDto: LoginUserDto): Promise<{ accessToken: string }> {
    const { email, password } = loginUserDto;
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (
      user &&
      user.password &&
      (await bcrypt.compare(password, user.password))
    ) {
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

      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      const existingUsername = await this.prisma.user.findUnique({
        where: { username },
      });

      if (existingUsername) {
        throw new ConflictException('Username already exists');
      }

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
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to register user');
    }
  }
}
