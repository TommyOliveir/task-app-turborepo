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

  async getAllTasksForCurrentUser(userId: string) {
    return this.prismaService.task.findMany({
      where: {
        userId: userId,
      },
    });
  }

  async getAllTasksWithFilter(search: string) {
    return this.prismaService.task.findMany({
      where: search
        ? {
            OR: [
              { title: { contains: String(search), mode: 'insensitive' } },
              {
                description: { contains: String(search), mode: 'insensitive' },
              },
            ],
          }
        : {},
    });
  }

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

  async getTaskById(id: string, userId: string) {
    const task = await this.prismaService.task.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!task) {
      throw new InternalServerErrorException(
        'User is not authorized to access this task',
      );
    }

    return task;
  }

  async updateTaskById(
    id: string,
    userId: string,
    updateTaskDto: UpdateTaskDto,
  ) {
    const task = await this.prismaService.task.findFirst({
      where: { id, userId },
    });

    if (!task) {
      throw new NotFoundException(
        `Task with id ${id} not found or not owned by user`,
      );
    }

    return this.prismaService.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  async deleteTaskById(id: string, userId: string) {
    const task = await this.prismaService.task.findFirst({
      where: { id, userId },
    });

    if (!task) {
      throw new NotFoundException(
        `Task with id ${id} not found or not owned by user`,
      );
    }

    return this.prismaService.task.delete({
      where: { id },
    });
  }
}
