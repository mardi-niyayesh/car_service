import {Module} from '@nestjs/common';
import {RedisModule} from "@/modules";
import {CleanerJobs} from "./jobs/cleaner.jobs";

@Module({
  imports: [RedisModule],
  providers: [CleanerJobs],
})
export class SchedulerModule {}
