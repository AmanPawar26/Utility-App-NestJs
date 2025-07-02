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
      City: ILike(`%${city}%`)  // Case-insensitive LIKE in PostgreSQL/SQLite
    },
    });

    if (!properties || properties.length === 0) {
    throw new Error(`No properties found for city: ${city}`);
  }

  return properties;
  }
  
}


