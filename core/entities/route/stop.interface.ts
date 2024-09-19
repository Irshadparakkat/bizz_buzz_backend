import { ApiProperty } from '@nestjs/swagger';

export class IRouteStop {
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
    example: '1',
  })
  order: number;
}
