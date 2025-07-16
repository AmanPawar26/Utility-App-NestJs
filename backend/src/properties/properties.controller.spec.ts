import { Test, TestingModule } from '@nestjs/testing';
import { PropertiesController } from './properties.controller';
import { PropertiesService } from './properties.service';
import { Properties } from "./properties.entity";
import { CreatePropertyDto } from './dto/createProperty.dto';
import { UpdatePropertyDto } from './dto/updateProperty.dto';

describe('PropertiesController', () => {
  let propertiesService: PropertiesService
  let controller: PropertiesController;

  const mockProperty = {
    id: 1,
    City: 'Sample City',
    Address: 'Sample Address',
    ZipCode: '12345',
    Property_Type: 'Condo',
    Price: '100000',
    Square_Feet: 1200,
    Beds: 3,
    Bathrooms: 2,
    Features: 'Pool, Garage',
    Listing_Type: 'Buy',
  }

  const mockPropertiesService = {
    getAllProperties: jest.fn().mockResolvedValue([mockProperty]),
    getPropertyById: jest.fn().mockResolvedValue(mockProperty),
    getPropertyByCity: jest.fn().mockResolvedValue(mockProperty),
    createProperty: jest.fn(),
    updatePropertyById: jest.fn(),
    deletePropertyById: jest.fn().mockResolvedValueOnce({ deleted: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertiesController],
      providers: [
        {
          provide: PropertiesService,
          useValue: mockPropertiesService
        }
      ]
    }).compile();

    propertiesService = module.get<PropertiesService>(PropertiesService);
    controller = module.get<PropertiesController>(PropertiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should get all properties', async () => {
    const result = await controller.getAllProperties();
    expect(result).toEqual([mockProperty]);
    expect(mockPropertiesService.getAllProperties).toHaveBeenCalled()
  })
  it('should get property by ID', async () => {
    const result = await controller.getPropertyById(mockProperty.id);
    expect(propertiesService.getPropertyById).toHaveBeenCalled();
    expect(result).toEqual(mockProperty)
  })
  it('should get property by city name', async () => {
    const result = await controller.getPropertyByCity(mockProperty.City);
    expect(propertiesService.getPropertyByCity).toHaveBeenCalled();
    expect(result).toEqual(mockProperty)
  })
  it('should create a new property', async () => {
    const newProperty = {
      City: 'New York',
      Address: '123 Test St',
      ZipCode: '10001',
      Property_Type: 'apartment',
      Price: '300000',
      Square_Feet: 900,
      Beds: 2,
      Bathrooms: 1.5,
      Features: 'Balcony',
      Listing_Type: 'sale'
    };
    mockPropertiesService.createProperty = jest.fn().mockResolvedValueOnce(mockProperty);

    const result = await controller.createProperty(
      newProperty as CreatePropertyDto
    );
    expect(propertiesService.createProperty).toHaveBeenCalled();
    expect(result).toEqual(mockProperty)
  })
  it('should update property by its ID', async () => {
    const updatedProperty = { ...mockProperty, City: 'Updated City' };
    const property = { City: 'Updated City' }

    mockPropertiesService.updatePropertyById = jest.fn().mockResolvedValueOnce(updatedProperty);
    const result = await controller.updatePropertyById(
      mockProperty.id,
      UpdatePropertyDto as any,
    );
    expect(propertiesService.updatePropertyById).toHaveBeenCalled();
    expect(result).toEqual(updatedProperty)
  })
  it('should delete a property by its ID', async () => {
    const result = await controller.deletePropertyById(mockProperty.id);

    expect(propertiesService.deletePropertyById).toHaveBeenCalled();
    expect(result).toEqual({deleted: true});
  })
});
