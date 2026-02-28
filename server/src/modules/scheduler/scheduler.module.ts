import {Module} from '@nestjs/common';
import {TokenCleanerService} from "./jobs/token-cleaner.jobs";

@Module({
  providers: [TokenCleanerService],
})
export class SchedulerModule {}