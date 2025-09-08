import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task-dto';

@Injectable()
export class TasksService {
  prisma: any;
  getHello(): string {
    return 'Hello';
  }
  async createArticle(createArticleDto: CreateTaskDto) {
    const { title, description } = createArticleDto;

    return this.prisma.article.create({
      data: {
        title,
        description,
      },
    });
  }
}
