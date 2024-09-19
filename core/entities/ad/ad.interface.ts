import { ApiProperty } from '@nestjs/swagger';
import { IBusiness } from '../business/business.interface';

export class IAd {
  @ApiProperty({
    example: 1,
  })
  adId?: number;

  @ApiProperty({
    example: 'name',
  })
  name: string;

  @ApiProperty({
    example: 'standard',
  })
  category: string;

  @ApiProperty({
    example: '27-05-2024',
  })
  validFrom: Date;

  @ApiProperty({
    example: '27-05-2024',
  })
  validTo: Date;

  @ApiProperty({
    example: 1000,
  })
  adRange: number;

  @ApiProperty({
    example: 'active',
  })
  status?: string;

  @ApiProperty({
    example: 'adurl',
  })
  adUrl: string;

  @ApiProperty({
    example: 'thumbnailUrl',
  })
  thumbnailUrl: string;

  @ApiProperty({
    example: 'sqrThumbnailUrl',
  })
  sqrThumbnailUrl: string;

  @ApiProperty({
    example: 10,
  })
  distance?: number;

  business: IBusiness;

  customerId?: number;

  liked?: boolean;

  createdTime?: Date;
  updatedTime?: Date;
}
