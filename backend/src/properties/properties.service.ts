import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Properties } from './properties.entity';
import { ILike } from 'typeorm';

@Injectable()
export class PropertiesService {
    constructor(
    @InjectRepository(Properties)
    private readonly propertyRepository: Repository<Properties>,
) {}


async getAllProperties(): Promise<Properties[]> {
    try {
        return await this.propertyRepository.find();
    } catch (error) {
        console.error('DB read error:', error);
        throw new Error('Failed to fetch Properties');
    }
}

async getPropertyById(id: number): Promise<Properties> {
   const property = await this.propertyRepository.findOneBy({ id });

    if (!property) {
      throw new Error(`Property with ID ${id} not found`);
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

 async createProperty(newProperty: {
  City: string;
  Address: string;
  ZipCode: string;
  Property_Type: string;
  Price: string;
  Square_Feet: number;
  Beds: number;
  Bathrooms: number;
  Features: string;
  Listing_Type: string;
}): Promise<Properties> {
  const created = this.propertyRepository.create(newProperty);
  return await this.propertyRepository.save(created);
}


async updatePropertyById(
  id: number,
  updatedFields: {
    City: string,
    Address: string,
    ZipCode: string,
    Property_Type: string,
    Price: string,
    Square_Feet: number,
    Beds: number,
    Bathrooms: number,
    Features: string,
    Listing_Type: string,
  }
): Promise<Properties> {
  const property = await this.propertyRepository.findOneBy({ id });

  if (!property) {
    throw new Error('Property not found');
  }

  // Update fields
  Object.assign(property, updatedFields);

  return await this.propertyRepository.save(property);
}


 
async deletePropertyById(id: number): Promise<void>{
  const result = await this.propertyRepository.delete(id);

  if (result.affected === 0) {
    throw new Error('User not found or already deleted')
  }
}
  
}


