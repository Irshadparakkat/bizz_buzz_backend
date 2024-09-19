import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IFavouriteStop } from 'core/entities/favouriteStop/favouriteStop.interface';

class FavouriteStopTitleDto {
  @ApiProperty({ type: [IFavouriteStop] })
  favouriteStop: [IFavouriteStop];
}

export class ResponseFavouriteStop {
  @ApiResponseProperty({
    example: true,
  })
  status: boolean;

  @ApiResponseProperty()
  data: FavouriteStopTitleDto;
}
