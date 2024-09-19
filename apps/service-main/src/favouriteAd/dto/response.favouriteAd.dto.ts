import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IFavouriteAd } from 'core/entities/favouriteAd/favouriteAd.interface';

class FavouriteAdTitleDto {
  @ApiProperty({ type: [IFavouriteAd] })
  favouriteAd: [IFavouriteAd];
}

export class ResponseFavouriteAd {
  @ApiResponseProperty({
    example: true,
  })
  status: boolean;

  @ApiResponseProperty()
  data: FavouriteAdTitleDto;
}
