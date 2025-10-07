import { IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  title!: string | undefined;

  @IsNotEmpty()
  description?: string;
}
