import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, ValidationPipe } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { Properties } from './properties.entity';
import { CreatePropertyDto } from './dto/createProperty.dto';
import { UpdatePropertyDto } from './dto/updateProperty.dto';

@Controller('properties')
export class PropertiesController {

    constructor(private readonly propertiesService: PropertiesService) { }

    @Get()
    getAllProperties() {
        return this.propertiesService.getAllProperties()
    }

    @Get(':id')
    getPropertyById(@Param('id', ParseIntPipe) id: number): Promise<Properties> {
        return this.propertiesService.getPropertyById(id);
    }

    @Get('city/:city')
    getPropertyByCity(@Param('city') city: string): Promise<Properties[]> {
        return this.propertiesService.getPropertyByCity(city);
    }

    @Post()
    createProperty(@Body(ValidationPipe) createPropertyDto: CreatePropertyDto) {
        return this.propertiesService.createProperty(createPropertyDto)
    }

    @Put(':id')
    updatePropertyById(@Param('id', ParseIntPipe) id: number, @Body(ValidationPipe) updatedPropertyDto: UpdatePropertyDto): Promise<Properties> {
        return this.propertiesService.updatePropertyById(id, updatedPropertyDto);
    }


    @Delete(':id')
    deletePropertyById(@Param('id', ParseIntPipe) id: number) {
        return this.propertiesService.deletePropertyById(+id);
    }
}
