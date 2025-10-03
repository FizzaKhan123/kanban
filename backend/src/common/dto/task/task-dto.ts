import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { TaskStatus } from 'src/entities/task.entity';

export class CreateTaskDto {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  description?: string;
}


export class UpdateTaskDto {
  @IsOptional()
  title?: string;

  @IsOptional()
  description?: string;

  @IsEnum(TaskStatus)
  status: TaskStatus;
}
