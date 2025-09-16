import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task-dto';
import { UpdateTaskDto } from './dto/update-task-dto';
import { AuthGuard } from '@nestjs/passport';
import { Logger } from '@nestjs/common';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController');
  constructor(private tasksService: TasksService) {}

  @Get()
  getAllTasks() {
    return this.tasksService.getAllTasks();
  }

  @Get('userstasks')
  async getAllTasksForCurrentUser(@Req() req: any) {
    const userId = req.user.userId;
    const { search } = req.query;

    let tasks;

    if (search) {
      tasks = await this.tasksService.getAllTasksWithFilter(search);
    } else {
      tasks = await this.tasksService.getAllTasksForCurrentUser(userId);
    }

    this.logger.verbose(
      `User ${req.user.username} fetched ${tasks.length} task(s)`,
    );

    return tasks;
  }

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto, @Req() req: any) {
    const userId = req.user.userId;
    this.logger.verbose(
      `User "${req.user.username}" create new task ${JSON.stringify(createTaskDto)}`,
    );
    return await this.tasksService.createTask(createTaskDto, userId);
  }

  @Get(':id')
  getTaskById(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.userId;
    return this.tasksService.getTaskById(id, userId);
  }

  @Patch(':id')
  updateTaskById(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: any,
  ) {
    const userId = req.user.userId;
    return this.tasksService.updateTaskById(id, userId, updateTaskDto);
  }

  @Delete(':id')
  deleteTaskById(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.userId;
    return this.tasksService.deleteTaskById(id, userId);
  }
}
