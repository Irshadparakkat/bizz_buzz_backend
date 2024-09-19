import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

export class UpdateSettingDto {
  @ApiProperty({
    example: 1000,
    required: false,
  })
  @IsOptional()
  @IsInt()
  minConversionPoints: number;

  @ApiProperty({
    example: 1000,
    required: false,
  })
  @IsOptional()
  @IsInt()
  minClaimPoints: number;

  @ApiProperty({
    example: 1000,
    required: false,
  })
  @IsOptional()
  @IsInt()
  rewardExpiryInDays: number;


  @ApiProperty({
    example: 1000,
    required: false,
  })
  @IsOptional()
  @IsInt()
  fullAdWatchedPoints: number;

  @ApiProperty({
    example: 1000,
    required: false,
  })
  @IsOptional()
  @IsInt()
  fiveSecAdWatchedPoints: number;
}
