import { ApiProperty } from '@nestjs/swagger';

export class GetParamUserDto {
  @ApiProperty({
    name: 'userId',
    required: true,
    description: 'Id of User',
  })
  userId: number;
}

export class GetQueryUserDto {
  @ApiProperty({
    name: 'limit',
    required: false,
    type: Number,
    description: 'limit for user to list',
  })
  limit?: number;

  @ApiProperty({
    name: 'offset',
    required: false,
    type: Number,
    description: 'number of items to skip from user list',
  })
  offset?: number;

  @ApiProperty({
    name: 'name',
    required: false,
    type: String,
    description: 'search by name',
  })
  name?: string;

  @ApiProperty({
    name: 'email',
    required: false,
    type: String,
    description: 'search by email',
  })
  email?: string;

  token?: string;
}

export class GetQueryVerifyUserDto {
  @ApiProperty({
    name: 'token',
    required: true,
    type: String,
    description: 'token',
  })
  token?: string;
}
