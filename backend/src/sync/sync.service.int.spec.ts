import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { SyncService } from './sync.service';
import { Properties } from 'src/properties/properties.entity';
import { SheetsService } from 'src/sheets/sheets.service';
import { SheetsModule } from 'src/sheets/sheets.module'; // ✅ if SheetsService is provided from a module
import { Repository } from 'typeorm';

describe('SyncService (integration)', () => {
  let service: SyncService;
  let repo : Repository<Properties>

   const mockSheetsService = {
    loadDataFromSheet: jest.fn(),
    saveDataToSheets: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [Properties],
          synchronize: true,
          logging: false,
        }),
        TypeOrmModule.forFeature([Properties]),
      ],
      providers: [
        SyncService, 
        {provide: SheetsService, useValue: mockSheetsService},
      ],
    }).compile();

    service = module.get<SyncService>(SyncService);
    repo = module.get<Repository<Properties>>(getRepositoryToken(Properties));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(async () => {
    await repo.clear();
    jest.clearAllMocks();
  })
  
  it('should load data from sheet into database', async () => {
      const mockSheetData = [
      {
        City: 'New York',
        Address: '123 5th Ave',
        ZipCode: '10001',
        'Property Type': 'Condo',
        Price: '500000',
        'Square Feet': '1000',
        Beds: '2',
        Bathrooms: '2',
        Features: 'Pool, Gym',
        'Listing Type': 'Buy',
      },
    ];
    mockSheetsService.loadDataFromSheet.mockResolvedValue(mockSheetData);

    const result = await service.loadData();

    expect(result).toBe('Data loaded from Google Sheet into SQLite');

    const savedProperties = await repo.find();
    expect(savedProperties.length).toBe(1);
    expect(savedProperties[0].City).toBe('New York');
    expect(savedProperties[0].Square_Feet).toBe(1000);
    expect(savedProperties[0].Property_Type).toBe('Condo');
  })

  it('Should save data to google sheet from database', async()=>{
    const saveData = repo.create({
       City: 'Los Angeles',
      Address: '456 Sunset Blvd',
      ZipCode: '90028',
      Property_Type: 'Villa',
      Price: '1500000',
      Square_Feet: 3000,
      Beds: 4,
      Bathrooms: 3,
      Features: 'Garage, Pool',
      Listing_Type: 'Sell',
    })
    await repo.save(saveData);

    mockSheetsService.saveDataToSheets.mockResolvedValue(undefined);

    const result = await service.saveData();

    expect(result).toBe('Data saved to Google Sheet from SQLite.')
    expect(mockSheetsService.saveDataToSheets).toHaveBeenCalledTimes(1);
    expect(mockSheetsService.saveDataToSheets).toHaveBeenCalledWith([
      {
        City: 'Los Angeles',
        Address: '456 Sunset Blvd',
        ZipCode: '90028',
        'Property Type': 'Villa',
        Price: '1500000',
        'Square Feet': 3000,
        Beds: 4,
        Bathrooms: 3,
        Features: 'Garage, Pool',
        'Listing Type': 'Sell',
      },
    ])
  })

});
