import { ApiProperty } from '@nestjs/swagger';
import { IDriver } from '../driver/driver.interface';

export class IBus {
  @ApiProperty({
    example: 1,
  })
  busId?: number;

  @ApiProperty({
    example: 'Sugama',
  })
  name: string;

  @ApiProperty({
    example: 'ABC123',
  })
  vehicleNumber: string;

  @ApiProperty({
    example: 50,
  })
  capacity: number;

  @ApiProperty({
    example: 'active',
  })
  status?: string;

  driver: Partial<IDriver> | IDriver[];

  createdTime?: Date;
  updatedTime?: Date;
}
