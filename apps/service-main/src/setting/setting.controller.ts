import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { SettingService } from './setting.service';
import { SingleOutput } from 'shared/output/single-output';
import { ErrorOutput } from 'shared/output/error-output';
import { ListOutput } from 'shared/output/list-output';
import { ISetting } from 'core/entities/setting/setting.interface';
import { Response } from 'express';
import { UpdateSettingDto } from './dto/update.setting.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseSetting } from './dto/response.setting.dto';
import { GetParamSettingDto } from './dto/get.setting.dto';
import { AuthGuard } from 'shared/auth/auth.guard';
import { SetPermission } from 'shared/auth/auth.decorator';
import { Permission } from 'shared/auth/auth.permissions';

@UseGuards(AuthGuard)
@ApiTags('Setting')
@Controller('settings')
export class SettingController {
  constructor(private service: SettingService) {}
  singleOutput: SingleOutput<ISetting> = new SingleOutput<ISetting>();
  errorOutput: ErrorOutput = new ErrorOutput();
  listOutput: ListOutput<ISetting> = new ListOutput();

  @ApiResponse({
    status: 200,
    type: ResponseSetting,
    description: 'Get one Setting by Id',
  })
  @SetPermission(Permission.GetSetting)
  @Get()
  async show(@Res() res: Response) {
    const setting = await this.service.showSetting();
    if (!setting) {
      return this.errorOutput.notFound(res, 'settings');
    }
    return this.singleOutput.single(res, setting, 'settings');
  }

  @ApiResponse({
    status: 200,
    type: ResponseSetting,
    description: 'Update one setting by Id',
  })
  @SetPermission(Permission.UpdateSetting)
  @Put()
  async update(@Body() body: UpdateSettingDto, @Res() res: Response) {
    const setting = await this.service.updateSetting(body);
    return this.singleOutput.single(res, setting, 'settings');
  }
}
