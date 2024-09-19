import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { ICustomer } from 'core/entities/customer/customer.interface';

class CustomerTitleDto {
  @ApiProperty({ type: [ICustomer] })
  customer: [ICustomer];
}

export class ResponseCustomer {
  @ApiResponseProperty({
    example: true,
  })
  status: boolean;

  @ApiResponseProperty()
  data: CustomerTitleDto;
}
