import { ApiProperty } from '@nestjs/swagger';

export class ICustomer {
  @ApiProperty({
    example: 1,
  })
  customerId?: number;

  @ApiProperty({
    example: 'name',
  })
  name: string;

  @ApiProperty({
    example: 'mail@example.com',
  })
  email: string;

  @ApiProperty({
    example: '123456',
  })
  loginToken?: string;

  @ApiProperty({
    example: 'active',
  })
  status?: string;

  @ApiProperty({
    example: '+91 1234567890',
  })
  phoneNumber?: string;

  @ApiProperty({
    example: 'A+',
  })
  bloodGroup?: string;

  @ApiProperty({
    example: 'unwilling',
  })
  donationStatus?: string;

  @ApiProperty({
    example: 'Tech@123',
  })
  password?: string;

  /** not in output */
  otp?: string;

  @ApiProperty({
    example: 'true',
  })
  verified?: boolean;

  @ApiProperty({
    example: '100',
  })
  milestone?: number;

  accessToken?: string;

  @ApiProperty({
    example: '1',
  })
  availableAmount?: number;

  @ApiProperty({
    example: 'date',
  })
  createdTime?: Date;

  @ApiProperty({
    example: 'date',
  })
  updatedTime?: Date;
}
