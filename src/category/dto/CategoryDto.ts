import { ApiProperty } from '@nestjs/swagger';

export class CategoryDto {
  @ApiProperty({ type: String, description: 'The name of the category' })
  name: string;

  @ApiProperty({ type: String, description: 'The description of the category' })
  description: string;

  @ApiProperty({ type: [Number], description: 'The parentId of the category' })
  parentId?: number;
}
