import { ApiProperty } from '@nestjs/swagger';
import { IRoute } from '../route/route.interface';
import { IBus } from '../bus/bus.interface';
import { IStopTime } from '../stop/stop.interface';
import { IJourney } from '../journey/journey.interface';

export class ITrip {
  @ApiProperty({
    example: 1,
  })
  tripId?: number;

  @ApiProperty({
    example: 'trip name',
  })
  tripName: string;

  route: IRoute | Partial<IRoute>;

  journey?: Partial<IJourney> | Partial<IJourney>[];

  bus: IBus | Partial<IBus> | null;

  stopTime?: IStopTime[];

  @ApiProperty({
    example: 'active',
  })
  status?: string;

  from?: number;
  to?: number;
  commenName?: string;

  createdTime?: Date;
  updatedTime?: Date;
}
