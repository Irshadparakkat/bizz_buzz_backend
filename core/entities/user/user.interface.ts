import { ApiProperty } from '@nestjs/swagger';

export class IUser {
  @ApiProperty({
    example: 1,
  })
  userId?: number;

  @ApiProperty({
    example: 'name',
  })
  name: string;

  @ApiProperty({
    example: 'mail@example.com',
  })
  email: string;

  verificationKey?: string;

  newPassword?: string;

  token?: string;
}
