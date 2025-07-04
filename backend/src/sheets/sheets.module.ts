import { Module } from '@nestjs/common';
import { SheetsService } from './sheets.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Properties } from 'src/properties/properties.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Properties]),
  ],
  providers: [SheetsService],
  exports: [SheetsService], 
})
export class SheetsModule {}
