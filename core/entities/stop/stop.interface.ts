import { ApiProperty } from '@nestjs/swagger';
import { IRoute } from '../route/route.interface';

export class IStop {
  @ApiProperty({
    example: 1,
  })
  stopId?: number;

  @ApiProperty({
    example: 'stop name',
  })
  name: string;

  @ApiProperty({
    example: 'Bangalore',
  })
  location: string;

  @ApiProperty({
    example: '37.2345',
  })
  latitude: number;

  @ApiProperty({
    example: '17.2785',
  })
  longitude: number;

  @ApiProperty({
    example: '500',
  })
  distance?: number;

  route?: IRoute[];

  customerId?: number;

  liked?: boolean;

  createdTime?: Date;

  updatedTime?: Date;
}

export class IStopTime {
  stop: IStop;

  min: number;

  hour: number;
}
