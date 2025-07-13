import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Properties } from './properties.entity';
import { ILike } from 'typeorm';
import { CreatePropertyDto } from './dto/createProperty.dto';
import { UpdatePropertyDto } from './dto/updateProperty.dto';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class PropertiesService {
    constructor(
    @InjectRepository(Properties)
    private readonly propertyRepository: Repository<Properties>,
) {}


async getAllProperties(): Promise<Properties[]> {
    try {
    const properties = await this.propertyRepository.find();
    return properties;
  } catch (error) {
    console.error('DB read error:', error);
    throw new Error(error.message || 'Failed to fetch Properties');
  }
}

async getPropertyById(id: number): Promise<Properties> {
   const property = await this.propertyRepository.findOneBy({ id });

    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    return property;
  }

  async getPropertyByCity(city: string): Promise<Properties[]> {
    const properties =  await this.propertyRepository.find({
        where: {
      City: ILike(`%${city}%`)  
    },
    });

    if (!properties || properties.length === 0) {
    throw new Error(`No properties found for city: ${city}`);
  }
  return properties;
  }

 async createProperty(createPropertyDto: CreatePropertyDto): Promise<Properties> {
  const created = this.propertyRepository.create(createPropertyDto);
  return await this.propertyRepository.save(created);
}


async updatePropertyById(
  id: number,
  updatedPropertyDto: UpdatePropertyDto
): Promise<Properties> {
  const property = await this.propertyRepository.findOneBy({ id });

  if (!property) {
    throw new Error('Property not found');
  }

  // Update fields
  Object.assign(property, updatedPropertyDto);

  return await this.propertyRepository.save(property);
}


 
async deletePropertyById(id: number): Promise<void>{
  const result = await this.propertyRepository.delete(id);

  if (result.affected === 0) {
    throw new Error('Property not found or already deleted')
  }

}
}


