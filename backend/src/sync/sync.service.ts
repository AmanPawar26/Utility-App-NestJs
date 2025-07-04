import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Properties } from 'src/properties/properties.entity';
import { SheetsService } from 'src/sheets/sheets.service';
import { Repository } from 'typeorm';


@Injectable()
export class SyncService {
    constructor(
        private readonly sheetsService : SheetsService,
        @InjectRepository(Properties)
        private readonly propertyRepo : Repository<Properties>,
    ) {}

    async loadData(): Promise<string> {
        const data = await this.sheetsService.loadDataFromSheet();

        await this.propertyRepo.clear();

        const formatted = data.map(row => this.propertyRepo.create({
            City: row.City,
            Address: row.Address,
            ZipCode: row.ZipCode,
            Property_Type: row['Property Type'] || 'Unknown',
            Price: row.Price,
            Square_Feet: +row['Square_Feet'] || 0,
            Beds: +row.Beds || 0,
            Bathrooms: +row.Bathrooms || 0,
            Features: row.Features,
            Listing_Type: row['Listing Type'] || 'Unknown',
        }))

        await this.propertyRepo.save(formatted);

        return 'Data loaded from Google Sheet into SQLite'
    }

    async saveData(): Promise<string> {

        try {
            const rows = await this.propertyRepo.find();

            const formatted = rows.map(row => ({
                City: row.City,
                Address: row.Address,
                ZipCode: row.ZipCode,
                'Property Type': row.Property_Type,
                Price: row.Price,
                'Square Feet': row.Square_Feet,
                Beds: row.Beds,
                Bathrooms: row.Bathrooms,
                Features: row.Features,
                'Listing Type': row.Listing_Type
            }));

            await this.sheetsService.saveDataToSheets(formatted);
            return 'Data saved to Google Sheet from SQLite.'
        } catch (error) {
             console.error('Error saving to Google Sheets:', error);
      throw new Error('Failed to save data to Google Sheets');
        }

    }

}  

