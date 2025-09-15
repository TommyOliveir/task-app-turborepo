import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task-dto';
import { PrismaService } from 'src/prismaService/prisma.service';
import { UpdateTaskDto } from './dto/update-task-dto';

@Injectable()
export class TasksService {
  constructor(private readonly prismaService: PrismaService) {}

  getHello(): string {
    return 'Hello';
  }

  async getAllTasks() {
    return this.prismaService.task.findMany({});
  }

  // async createTask(createTaskDto: CreateTaskDto, userId: string) {
  //   const { title = '', description } = createTaskDto;

  //   return this.prismaService.task.create({
  //     data: {
  //       title,
  //       description,
  //       user: { connect: { id: userId } },
  //     },
  //   });
  // }

  async createTask(createTaskDto: CreateTaskDto, userId: string) {
    try {
      const { title = '', description } = createTaskDto;
      return await this.prismaService.task.create({
        data: {
          title,
          description,
          user: {
            connect: { id: userId },
          },
        },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('error');
    }
  }

  async getTaskById(id: string) {
    return this.prismaService.task.findUnique({
      where: {
        id,
      },
    });
  }

  async updateTaskById(id: string, updateTaskDto: UpdateTaskDto) {
    try {
      return await this.prismaService.task.update({
        where: { id },
        data: updateTaskDto,
      });
    } catch (error: any) {
      if (error?.code === 'P2025') {
        throw new NotFoundException(`Task with id ${id} not found`);
      }
      throw error;
    }
  }

  async deleteTaskById(id: string) {
    return this.prismaService.task
      .delete({ where: { id } })
      .catch((error: any) => {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Task with id ${id} not found`);
        }
        throw error;
      });
  }
}
