import { ApiProperty } from '@nestjs/swagger';
import { IRouteStop } from './stop.interface';
import { IStop } from '../stop/stop.interface';

export class IRoute {
  @ApiProperty({
    example: 1,
  })
  routeId?: number;

  @ApiProperty({
    example: 'name',
  })
  name: string;

  @ApiProperty({
    example: 'Via location',
  })
  via: string;

  @ApiProperty()
  stop?: IRouteStop[];

  /** for condition */
  routeStop?: { stop: Partial<IStop> };

  createdTime?: Date;
  updatedTime?: Date;
}
