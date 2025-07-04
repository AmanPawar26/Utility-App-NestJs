import { Module } from '@nestjs/common';
import { SyncController } from './sync.controller';
import { SyncService } from './sync.service';
import { SheetsService } from 'src/sheets/sheets.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Properties } from '../properties/properties.entity';

@Module({
    imports:  [TypeOrmModule.forFeature([Properties])], 
    controllers: [SyncController],
    providers: [SyncService, SheetsService]
})
export class SyncModule {}
