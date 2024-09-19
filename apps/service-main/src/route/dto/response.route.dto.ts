import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IRoute } from 'core/entities/route/route.interface';

class RouteTitleDto {
  @ApiProperty({ type: [IRoute] })
  business: [IRoute];
}

export class ResponseRoute {
  @ApiResponseProperty({
    example: true,
  })
  status: boolean;

  @ApiResponseProperty()
  data: RouteTitleDto;
}
