import { Controller, Get, Post, Body } from '@nestjs/common';
import { SyncService } from './sync.service';

@Controller('sync')
export class SyncController {
    constructor(private readonly syncService: SyncService) { }

    @Get('load')
    async loadData() {
        return { message: await this.syncService.loadData() };
    }

    @Post('save')
    async saveData() {
        return { message: await this.syncService.saveData() };
    }

}
