import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '@entities/task.entity';
import { User } from '@entities/user.entity';
import { CreateTaskDto ,UpdateTaskDto} from '@common/dto/task/task-dto';


@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
  // 1️⃣ First fetch the user from the database
  const existingUser = await this.userRepository.findOne({
    where: { id: user.id },
  });

  if (!existingUser) {
    throw new NotFoundException('User not found');
  }

  const task = this.taskRepository.create({
    ...createTaskDto,
    user: existingUser,
  });

  return await this.taskRepository.save(task);
}


  async getTasks(user: User): Promise<Task[]> {
    return await this.taskRepository.find({ where: { user: { id: user.id } } });
  }

  async getTaskById(id: number, user: User): Promise<Task> {
  const task = await this.taskRepository.findOne({ where: { id, user } });
  if (!task) {
    throw new NotFoundException('Task not found');
  }
  return task;
}


  async updateTask(id: number, updateTaskDto: UpdateTaskDto, user: User): Promise<Task> {
  const task = await this.taskRepository.findOne({
    where: {
      id,
      user: { id: user.id },
    },
  });

  if (!task) {
    throw new NotFoundException('Task not found');
  }

  Object.assign(task, updateTaskDto);
  return await this.taskRepository.save(task);
}


 async deleteTask(id: number, user: User): Promise<{ message: string }> {
  const result = await this.taskRepository.delete({
    id,
    user: { id: user.id },
  });

  if (result.affected === 0) {
    throw new NotFoundException('Task not found');
  }

  return { message: 'Task deleted successfully' };
}

}
