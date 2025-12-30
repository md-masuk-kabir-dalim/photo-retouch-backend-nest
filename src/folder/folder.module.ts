import { AuthSchema } from './../auth/auth.schema';
import { OrgSchema } from './../organization/organization.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { FolderSchema } from './folder.schema';
import { ModelsSchema } from 'src/models/models.schema';
import { FolderController } from './folder.controller';
import { FolderService } from './folder.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Folder', schema: FolderSchema },
      { name: 'Organization', schema: OrgSchema },
      { name: 'Auth', schema: AuthSchema },
      { name: 'Models', schema: ModelsSchema },
    ]),
  ],
  controllers: [FolderController],
  providers: [FolderService],
})
export class FolderModule {}
