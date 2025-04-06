import { ApiProperty } from '@nestjs/swagger';

export class AnimalDto {
  @ApiProperty({ type: String, description: 'The name of the Animal' })
  name: string;

  @ApiProperty({ type: String, description: 'The description of the Animal' })
  description: string;

  @ApiProperty({
    type: [Number],
    description: 'The categoryIds of the Animal',
    required: false,
  })
  categoryIds?: number[];
}
