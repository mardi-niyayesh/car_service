import {Module} from '@nestjs/common';
import {CleanerJobs} from "./jobs/cleaner.jobs";

@Module({
  providers: [CleanerJobs],
})
export class SchedulerModule {}