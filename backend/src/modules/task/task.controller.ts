import { Controller, Post, Body, UseGuards, Req, Get, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto ,UpdateTaskDto } from '@common/dto/task/task-dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto, @Req() req) {
    return this.taskService.createTask(createTaskDto, req.user);
  }

   @Get(':id')
async getTaskById(@Param('id', ParseIntPipe) id: number, @Req() req) {
  return this.taskService.getTaskById(id, req.user);
}


  @Get()
  async getTasks(@Req() req) {
    return this.taskService.getTasks(req.user);
  }

  @Patch(':id')
  async updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req,
  ) {
    return this.taskService.updateTask(id, updateTaskDto, req.user);
  }

  @Delete(':id')
  async deleteTask(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.taskService.deleteTask(id, req.user);
  }
}
