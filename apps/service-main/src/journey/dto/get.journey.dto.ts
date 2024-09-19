import { ApiProperty } from '@nestjs/swagger';

export class GetParamJourneyDto {
  @ApiProperty({
    name: 'journeyId',
    required: true,
    description: 'Id of Journey',
  })
  journeyId: number;
}

export class GetQueryJourneyDto {
  @ApiProperty({
    name: 'limit',
    required: false,
    type: Number,
    description: 'limit for journey to list',
  })
  limit?: number;

  @ApiProperty({
    name: 'offset',
    required: false,
    type: Number,
    description: 'number of items to skip from journey list',
  })
  offset?: number;

  @ApiProperty({
    name: 'journeyId',
    required: false,
    description: 'Id of Journey',
  })
  journeyId?: number;

  @ApiProperty({
    name: 'status',
    required: false,
    description: 'status of Journey',
  })
  status?: string;

  @ApiProperty({
    name: 'tripId',
    required: false,
    description: 'tripId of Journey',
  })
  tripId?: number;
}
