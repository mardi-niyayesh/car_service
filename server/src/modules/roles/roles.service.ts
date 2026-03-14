import {Injectable} from "@nestjs/common";
import {PrismaService} from "@/modules/prisma/prisma.service";

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  test() {
    return this.prisma.role.findMany();
  }
}