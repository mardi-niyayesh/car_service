import {Controller, Get} from "@nestjs/common";
import {PermissionsService} from "./permissions.service";

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  test(): string {
    return this.permissionsService.findAll();
  }
}