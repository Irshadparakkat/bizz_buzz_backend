import { ApiResponseProperty } from '@nestjs/swagger';

export class DeleteOutputDTO<T> {
  @ApiResponseProperty({
    example: true,
  })
  status: boolean;

  @ApiResponseProperty({
    example: {
      deleted: true,
    },
  })
  data: {
    deleted: boolean;
  };
}
