import { AuthSchema } from './../auth/auth.schema';
import { OrgSchema } from './../organization/organization.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ModelsSchema } from './models.schema';
import { ModelsController } from './models.controller';
import { ModelsService } from './models.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Models', schema: ModelsSchema },
      { name: 'Organization', schema: OrgSchema },
      { name: 'Auth', schema: AuthSchema },
    ]),
  ],
  controllers: [ModelsController],
  providers: [ModelsService],
})
export class ModelsModule {}
