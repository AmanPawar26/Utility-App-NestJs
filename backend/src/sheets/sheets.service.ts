import { Injectable } from '@nestjs/common';
import { google, GoogleApis } from 'googleapis';
import { readFile } from 'fs/promises';
import * as dotenv from 'dotenv'

@Injectable()
export class SheetsService {
    private async authorizeGoogleSheet() {
        const credentialsPath = process.env.GOOGLE_SHEETS_KEY_PATH;
        if (!credentialsPath) {
            throw new Error('GOOGLE_SHEETS_KEY_PATH environment variable is not set.');
        }
        const credentials = JSON.parse(await readFile(credentialsPath, 'utf-8'))

        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });
        return sheets;
    }

    async loadDataFromSheet(): Promise<any[]> {
        const sheets = await this.authorizeGoogleSheet();
        const sheetId = process.env.SHEET_ID;

        const res = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: `'Sheet1'!A1:Z100`
        })
        const rows = res.data.values

        if (!rows || rows.length == 0) {
            console.log('No data found in sheet');
            return [];
        }

        const headers = rows[0];
        const data = rows.slice(1).map((rows) => {
            const rowData = {};
            headers.forEach((header, i) => {
                rowData[header] = rows[i] || '';
            });
            return rowData;
        })
        return data;
    }

    async saveDataToSheets(rows: any[]): Promise<void> {
        const sheets = await this.authorizeGoogleSheet();
        const sheetId = process.env.SHEET_ID;

        if (!rows || rows.length === 0) {
            console.log('No data to save');
            return;
        }

        const headers = Object.keys(rows[0]);
        const values = [headers, ...rows.map(row => headers.map(h => row[h]))];

        await sheets.spreadsheets.values.update({
            spreadsheetId: sheetId,
            range: `'Sheet1'!A1:Z1000`,
            valueInputOption: 'RAW',
            requestBody: {
                values,
            },
        });
        console.log('Data saved to google sheet successfully')

    }
}

