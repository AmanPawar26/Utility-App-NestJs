import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { Properties } from './properties.entity';

@Controller('properties')
export class PropertiesController {

    constructor(private readonly propertiesService: PropertiesService) { }

    @Get()
    getAllProperties() {
        return this.propertiesService.getAllProperties()
    }

    @Get(':id')
    getPropertyById(@Param('id') id: number): Promise<Properties> {
        return this.propertiesService.getPropertyById(id);
    }

    @Get('city/:city')
    getPropertyByCity(@Param('city') city: string): Promise<Properties[]> {
        return this.propertiesService.getPropertyByCity(city);
    }

    @Post()
    createProperty(@Body() newProperty: { City: string, Address: string, ZipCode: string, Property_Type: string, Price: string, Square_Feet: number, Beds: number, Bathrooms: number, Features: string, Listing_Type: string },) {
        return this.propertiesService.createProperty(newProperty)
    }

    @Put(':id')
    updatePropertyById(@Param('id') id: number, @Body() updatedFields: { City: string, Address: string, ZipCode: string, Property_Type: string, Price: string, Square_Feet: number, Beds: number, Bathrooms: number, Features: string, Listing_Type: string }): Promise<Properties> {
        return this.propertiesService.updatePropertyById(id, updatedFields);
    }


    @Delete(':id')
    deletePropertyById(@Param('id') id: number) {
        return this.propertiesService.deletePropertyById(+id);
    }
}
