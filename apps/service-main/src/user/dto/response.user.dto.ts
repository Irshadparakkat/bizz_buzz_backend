import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IUser } from 'core/entities/user/user.interface';

class UserTitleDto {
  @ApiProperty({ type: [IUser] })
  user: [IUser];
}

export class ResponseUser {
  @ApiResponseProperty({
    example: true,
  })
  status: boolean;

  @ApiResponseProperty()
  data: UserTitleDto;
}
