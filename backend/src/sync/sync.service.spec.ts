import { Test, TestingModule } from '@nestjs/testing';
import { SyncService } from './sync.service';
import { Repository } from 'typeorm';
import { Properties } from 'src/properties/properties.entity';
import { SheetsService } from 'src/sheets/sheets.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('SyncService', () => {
  let service: SyncService;
  let propertyRepo: jest.Mocked<Partial<Repository<Properties>>>;
  let sheetsService: jest.Mocked<SheetsService>;

  const mockDataFromSheet = [
    {
      City: 'Test City',
      Address: '123 Test Street',
      ZipCode: '12345',
      'Property Type': 'House',
      Price: '500000',
      'Square Feet': '2000',
      Beds: '3',
      Bathrooms: '2',
      Features: 'Garage, Pool',
      'Listing Type': 'Sale',
    },
  ];

   const mockFormattedEntity = {
    City: 'Test City',
    Address: '123 Test Street',
    ZipCode: '12345',
    Property_Type: 'House',
    Price: '500000',
    Square_Feet: 2000,
    Beds: 3,
    Bathrooms: 2,
    Features: 'Garage, Pool',
    Listing_Type: 'Sale',
  };



  beforeEach(async () => {
    propertyRepo = {
      clear: jest.fn(),
      create: jest.fn().mockReturnValue(mockFormattedEntity),
      save: jest.fn(),
      find: jest.fn().mockResolvedValue([mockFormattedEntity])
    };

    sheetsService = {
      loadDataFromSheet: jest.fn().mockResolvedValue(mockDataFromSheet),
      saveDataToSheets: jest.fn(),
    } as any;

    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SyncService,
        {provide: getRepositoryToken(Properties), useValue: propertyRepo},
        {provide: SheetsService, useValue: sheetsService},
      ],
    }).compile();

    service = module.get<SyncService>(SyncService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('loadData', ()=>{
    it('should load data from Google Sheets and save to DB', async () => {
      const result = await service.loadData();

      expect(sheetsService.loadDataFromSheet).toHaveBeenCalled();
      expect(propertyRepo.clear).toHaveBeenCalled();
      expect(propertyRepo.create).toHaveBeenCalledTimes(1);
      expect(propertyRepo.save).toHaveBeenCalledWith([mockFormattedEntity]);
      expect(result).toBe('Data loaded from Google Sheet into SQLite')
    })
  })
  describe('saveData', ()=>{
    it('should save data from DB to Google Sheets', async()=>{
      const result = await service.saveData();

      expect(propertyRepo.find).toHaveBeenCalled();
      expect(sheetsService.saveDataToSheets).toHaveBeenCalledWith([
        {
          City: 'Test City',
          Address: '123 Test Street',
          ZipCode: '12345',
          'Property Type': 'House',
          Price: '500000',
          'Square Feet': 2000,
          Beds: 3,
          Bathrooms: 2,
          Features: 'Garage, Pool',
          'Listing Type': 'Sale',
        },
      ]);
      expect(result).toBe('Data saved to Google Sheet from SQLite.')
    })

    it('should throw error if saving data to sheet fails', async()=>{
      sheetsService.saveDataToSheets.mockRejectedValue(new Error('Google Sheets error'));

      await expect(service.saveData()).rejects.toThrow('Failed to save data to Google Sheets');
    })
  })
});
