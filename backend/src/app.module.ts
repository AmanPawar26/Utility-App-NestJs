import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SheetsModule } from './sheets/sheets.module';
import { SyncModule } from './sync/sync.module';
import {Properties} from './properties/properties.entity'
import { PropertiesModule } from './properties/properties.module';



@Module({
  imports: [SheetsModule, SyncModule, PropertiesModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      entities: [Properties],
      synchronize: true,
      logging: true,
    }),
    PropertiesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
