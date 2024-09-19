import { ApiProperty } from '@nestjs/swagger';
import { IBus } from '../bus/bus.interface';

export class IDriver {
  @ApiProperty({
    example: 1,
  })
  driverId?: number;

  @ApiProperty({
    example: 'name',
  })
  name: string;

  @ApiProperty({
    example: 'mail@example.com',
  })
  email?: string;

  @ApiProperty({
    example: '+1234567890',
  })
  phoneNumber?: string;

  @ApiProperty({
    example: 'active',
    required: false,
  })
  status?: string;

  @ApiProperty({
    example: 'driver',
  })
  role?: string;

  @ApiProperty({
    example: 'password123',
    required: false,
  })
  password?: string;

  @ApiProperty({
    example: 'A+',
  })
  bloodGroup?: string;

  @ApiProperty({
    example: 'unwilling',
  })
  donationStatus?: string;

  bus: IBus[];

  /** not in output */
  otp?: string;

  accessToken?: string;

  createdTime?: Date;
  updatedTime?: Date;
}

export class IDriverTripTiming {
  @ApiProperty({
    example: 1,
  })
  driverId?: number;

  @ApiProperty({
    example: 1,
  })
  tripId: number;

  @ApiProperty({
    example: 'SRS',
  })
  busName: string;

  @ApiProperty({
    example: 'palakkad-trissur',
  })
  tripName: string;

  @ApiProperty({
    example: {
      min: 45,
      hour: 9,
    },
  })
  start: {
    min: number;
    hour: number;
  };

  accessToken?: string;
}
