import { ApiProperty } from '@nestjs/swagger';

export class ISetting {
  @ApiProperty({
    example: 1,
  })
  settingId?: number;

  @ApiProperty({
    example: 1000,
  })
  minConversionPoints: number;

  @ApiProperty({
    example: 1000,
  })
  minClaimPoints: number;

  @ApiProperty({
    example: 50,
  })
  rewardExpiryInDays: number;

  @ApiProperty({
    example: 1000,
  })
  fullAdWatchedPoints: number;

  @ApiProperty({
    example: 400,
  })
  fiveSecAdWatchedPoints: number;

  createdTime?: Date;
  updatedTime?: Date;
}
