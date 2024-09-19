import { ApiProperty } from '@nestjs/swagger';
import { IBusiness } from '../business/business.interface';

export class IInstantOffer {
  @ApiProperty({
    example: 1,
  })
  instantOfferId?: number;

  @ApiProperty({
    example: 'Celebrate with us and save 15% sitewide using code EID15.',
  })
  message: string;

  @ApiProperty({
    example: '27-05-2024',
  })
  validFrom: Date;

  @ApiProperty({
    example: '27-05-2024',
  })
  validTo: Date;

  @ApiProperty({
    example: '10mtr',
  })
  instantOfferRange: string;

  @ApiProperty({
    example: 100,
  })
  userCount: number;

  @ApiProperty({
    example: 'active',
  })
  status: string;

  business: IBusiness;

  createdTime?: Date
  updatedTime?: Date
}