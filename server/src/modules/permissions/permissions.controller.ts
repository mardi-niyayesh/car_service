import {Controller, Get} from "@nestjs/common";
import {Permission, PERMISSIONS} from "@/common";
import {PermissionsService} from "./permissions.service";

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Permission({
    permissions: [PERMISSIONS.PERMISSION_VIEW]
  })
  @Get()
  test(): string {
    return this.permissionsService.findAll();
  }
}