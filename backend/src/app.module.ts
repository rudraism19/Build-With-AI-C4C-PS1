import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import supabaseConfig from './config/supabase.config';
import { SupabaseModule } from './supabase/supabase.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ComplaintsModule } from './complaints/complaints.module';
import { LocationsModule } from './locations/locations.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { HotspotsModule } from './hotspots/hotspots.module';
import { PrioritiesModule } from './priorities/priorities.module';
import { PoliciesModule } from './policies/policies.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { PolicymakerModule } from './policymaker/policymaker.module';
import { AuditModule } from './audit/audit.module';
import { DataModule } from './data/data.module';
import { HealthModule } from './health/health.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [supabaseConfig],
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 seconds
        limit: 100, // 100 requests per minute
      },
    ]),
    SupabaseModule,
    AuthModule,
    UsersModule,
    ComplaintsModule,
    LocationsModule,
    AnalyticsModule,
    HotspotsModule,
    PrioritiesModule,
    PoliciesModule,
    RecommendationsModule,
    PolicymakerModule,
    AuditModule,
    DataModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
