import { AuthSchema } from './../auth/auth.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { AnalysisSchema } from './analysis.schema';
import { AnalysisController } from './analysis.controller';
import { AnalysisService } from './analysis.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Analysis', schema: AnalysisSchema },
      { name: 'Auth', schema: AuthSchema },
    ]),
    
  ],
  controllers: [AnalysisController],
  providers: [AnalysisService],
})
export class AnalysisModule {}
