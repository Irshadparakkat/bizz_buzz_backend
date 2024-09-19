import { ApiResponseProperty } from '@nestjs/swagger';

export class SuccessOutputDTO {
  @ApiResponseProperty({
    example: true,
  })
  status: boolean;
}
