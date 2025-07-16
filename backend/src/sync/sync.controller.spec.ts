import { Test, TestingModule } from '@nestjs/testing';
import { SyncController } from './sync.controller';
import { SyncService } from './sync.service';

describe('SyncController', () => {
  let syncService: SyncService
  let controller: SyncController;

  const mocksheetData = {
    id: 1,
    City: 'Sample City',
    Address: 'Sample Address',
    ZipCode: '12345',
    Property_Type: 'Condo',
    Price: '100000',
    Square_Feet: 1200,
    Beds: 3,
    Bathrooms: 2,
    Features: 'Pool, Garage',
    Listing_Type: 'Buy',
  }

  const mocksyncService = {
    loadData: jest.fn().mockResolvedValue([mocksheetData]),
    saveData: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SyncController],
      providers: [
        {
          provide: SyncService,
          useValue: mocksyncService
        }
      ]
    }).compile();

    syncService = module.get<SyncService>(SyncService);
    controller = module.get<SyncController>(SyncController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should save data from google sheet to sqlite db', async () => {
    const result = await controller.loadData();
    expect(result).toEqual({ message: [mocksheetData] });
    expect(mocksyncService.loadData).toHaveBeenCalled()
  })
  it('should save data to google sheet from sqlite db', async () => {
    const saveMessage = 'Data saved to Google Sheets';
    mocksyncService.saveData = jest.fn().mockResolvedValue(saveMessage);

    const result = await controller.saveData();

    expect(result).toEqual({ message: saveMessage });
    expect(mocksyncService.saveData).toHaveBeenCalled();
  })
});
