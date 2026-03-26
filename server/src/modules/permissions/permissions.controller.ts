import {Controller, Get} from "@nestjs/common";

@Controller('permissions')
export class PermissionsController {
  @Get()
  test() {
    return 'test permissions';
  }
}