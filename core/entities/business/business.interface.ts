import { ApiProperty } from '@nestjs/swagger';

export class IBusiness {
  @ApiProperty({
    example: 1,
  })
  businessId?: number;

  @ApiProperty({
    example: 'name',
  })
  name: string;

  @ApiProperty({
    example: 'username',
  })
  username?: string;

  @ApiProperty({
    example: 'mail@example.com',
  })
  email: string;

  @ApiProperty({
    example: 'active',
  })
  status?: string = 'active';

  @ApiProperty({
    example: '1234567890',
  })
  phoneNumber: string;

  @ApiProperty({
    example: 'IT',
  })
  businessType: string;

  @ApiProperty({
    example: '123 Street, Area',
  })
  address?: string;

  @ApiProperty({
    example: 'Kerala',
  })
  state?: string;

  @ApiProperty({
    example: 'Kannur',
  })
  city?: string;

  @ApiProperty({
    example: '123456',
  })
  pincode?: string;

  @ApiProperty({
    example: 'GST123456',
  })
  gst?: string;

  @ApiProperty({
    example: 'Location Name',
  })
  location: string;

  @ApiProperty({
    example: 12.345678,
  })
  latitude: number;

  @ApiProperty({
    example: 98.765432,
  })
  longitude: number;

  /** not in output */
  otp?: string;
  password?: string;

  accessToken?: string;

  createdTime?: Date;
  updatedTime?: Date;
}
