import { Test, TestingModule } from '@nestjs/testing';
import { SheetsService } from './sheets.service';
import { google } from 'googleapis';
import { readFile } from 'fs/promises';


jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
}));

const mockUpdate = jest.fn()

 jest.mock('googleapis', ()=> ({
    google: {
      auth: {
        GoogleAuth: jest.fn().mockImplementation(()=>({
          getClient: jest.fn().mockResolvedValue({}),
        })),
      },
      sheets: jest.fn().mockReturnValue({
        spreadsheets: {
          values: {
            update: mockUpdate,
            get: jest.fn().mockResolvedValue({
              data: {
                values: [
                  ['City', 'ZipCode'],
                  ['San Jose', '123'],
                  ['Sacramento', '451'],

                ]
              }
            })
          }
        }
      })
    }
  }))

describe('SheetsService', () => {
  let service: SheetsService;

 
  beforeEach(async () => {
    process.env.GOOGLE_SHEETS_KEY_PATH = './fake-key.json';
    process.env.SHEET_ID = 'fake-sheet-id';

        (readFile as jest.Mock).mockResolvedValue(JSON.stringify({
      client_email: 'fake@fake.iam.gserviceaccount.com',
      private_key: '-----BEGIN PRIVATE KEY-----\nFAKE\n-----END PRIVATE KEY-----\n',
    }));


    const module: TestingModule = await Test.createTestingModule({
      providers: [SheetsService],
    }).compile();

    service = module.get<SheetsService>(SheetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should load data from sheet and return mapped rows', async()=>{
    const result = await service.loadDataFromSheet();
    expect(result).toEqual([
      { City: 'San Jose', ZipCode: '123' },
      { City: 'Sacramento', ZipCode: '451' },
    ])
  })
  it('should save data from db to sheet', async()=>{
    const mockRows = [
      { City: 'New York', ZipCode: '10001' },
      { City: 'Boston', ZipCode: '02118' },
    ];
    await service.saveDataToSheets(mockRows);

    expect(mockUpdate).toHaveBeenCalledWith({
      spreadsheetId: 'fake-sheet-id',
      range: `'Sheet1'!A1:Z1000`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [
          ['City', 'ZipCode'],
          ['New York', '10001'],
          ['Boston', '02118'],
        ],
      },
    });
  })
  it('should not call update if no rows are provided', async () => {
    await service.saveDataToSheets([]);
    expect(mockUpdate).not.toHaveBeenCalled();
  });
});
