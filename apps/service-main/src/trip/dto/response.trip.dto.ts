import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { ITrip } from 'core/entities/trip/trip.interface';

class TripTitleDto {
  @ApiProperty({ type: [ITrip] })
  Trip: [ITrip];
}

export class ResponseTrip {
  @ApiResponseProperty({
    example: true,
  })
  status: boolean;

  @ApiResponseProperty()
  data: TripTitleDto;
}
