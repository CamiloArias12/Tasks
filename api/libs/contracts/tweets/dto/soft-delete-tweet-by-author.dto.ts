import { IsNotEmpty } from 'class-validator';

export class SoftDeleteTweetByUserorDto {
  @IsNotEmpty()
  authorId: string;
}
