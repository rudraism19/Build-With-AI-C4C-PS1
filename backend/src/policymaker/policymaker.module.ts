import { Module } from '@nestjs/common';
import { PolicymakerController } from './policymaker.controller';
import { PolicymakerService } from './policymaker.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { UsersModule } from '../users/users.module';
import { HotspotsModule } from '../hotspots/hotspots.module';
import { PrioritiesModule } from '../priorities/priorities.module';
import { RecommendationsModule } from '../recommendations/recommendations.module';
import { AnalyticsModule } from '../analytics/analytics.module';

@Module({
  imports: [
    SupabaseModule,
    UsersModule,
    HotspotsModule,
    PrioritiesModule,
    RecommendationsModule,
    AnalyticsModule,
  ],
  controllers: [PolicymakerController],
  providers: [PolicymakerService],
  exports: [PolicymakerService],
})
export class PolicymakerModule {}
