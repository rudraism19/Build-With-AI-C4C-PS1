import { Module } from '@nestjs/common';
import { ComplaintsController } from './complaints.controller';
import { ComplaintsService } from './complaints.service';
import { UsersModule } from '../users/users.module';
import { AiModule } from '../ai/ai.module';
import { LocationsModule } from '../locations/locations.module';

@Module({
  imports: [UsersModule, AiModule, LocationsModule],
  controllers: [ComplaintsController],
  providers: [ComplaintsService],
  exports: [ComplaintsService],
})
export class ComplaintsModule {}
