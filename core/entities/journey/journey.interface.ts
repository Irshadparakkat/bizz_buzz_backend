import { ApiProperty } from '@nestjs/swagger';
import { IDriver } from '../driver/driver.interface';
import { ITrip } from '../trip/trip.interface';

export class IJourney {
  @ApiProperty({
    example: 1,
  })
  journeyId?: number;

  driver: IDriver;

  trip?: ITrip | Partial<ITrip>;

  @ApiProperty({
    example: 'active',
  })
  status: string;

  createdTime?: Date;

  updatedTime?: Date;
}
