import { Test, TestingModule } from "@nestjs/testing";
import { PropertiesService } from "./properties.service"
import { getRepositoryToken } from "@nestjs/typeorm";
import { Properties } from "./properties.entity";
import { Repository } from "typeorm";

describe('PropertiesService', ()=>{
  let service : PropertiesService;
  let propertyRepo  : jest.Mocked<Partial<Repository<Properties>>>;

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

  beforeEach(async () => {
     propertyRepo  = {
      find: jest.fn().mockResolvedValue([mockProperty]),
      findOneBy: jest.fn().mockResolvedValue(mockProperty),
      create: jest.fn().mockResolvedValue(mockProperty),
      save: jest.fn().mockResolvedValue(mockProperty),
      update: jest.fn().mockResolvedValue(mockProperty),
      delete: jest.fn().mockResolvedValue({affected: 1}),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PropertiesService,
        {
          provide: getRepositoryToken(Properties),
          useValue: propertyRepo,
        }
        ],
    }).compile()
    service = module.get<PropertiesService>(PropertiesService);
    
  });
   it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should return all properties', async() => {
    const result = await service.getAllProperties();
    expect(result).toEqual([mockProperty]);
    expect(propertyRepo.find).toHaveBeenCalled();
  })
  it('should return a property by id', async()=>{
     const result = await service.getPropertyById(1);
     expect(result).toEqual(mockProperty);
     expect(propertyRepo.findOneBy).toHaveBeenCalledWith({id: 1})
  })
  it('should throw error if property with a given id not found', async()=>{
    propertyRepo.findOneBy = jest.fn().mockResolvedValue(null);
    await expect(service.getPropertyById(999)).rejects.toThrow('Property with ID 999 not found')
  });

  it('should return properties based on city name', async () => {
    
    propertyRepo.find = jest.fn().mockResolvedValue([mockProperty]);

    const result = await service.getPropertyByCity('Sample City');

    expect(result).toEqual([mockProperty]);

    
    expect(propertyRepo.find).toHaveBeenCalledWith({
      where: {
        City: expect.any(Object), 
      },
    });
  });

  it('should throw error if property with a given city is not found', async() => {
    propertyRepo.find = jest.fn().mockResolvedValue([]);
    await expect(service.getPropertyByCity("")).rejects.toThrow('No properties found for city: ')
  })

  it('Should create a new Property', async()=>{
    const newProperty = {
    id: 1,
    City: 'New City',
    Address: 'New Address',
    ZipCode: '12345',
    Property_Type: 'Condo',
    Price: '100000',
    Square_Feet: 1200,
    Beds: 3,
    Bathrooms: 2,
    Features: 'Pool, Garage',
    Listing_Type: 'Buy',
  }
  const mockProperty = {...newProperty};
 
  propertyRepo.create = jest.fn().mockReturnValue(newProperty);
  propertyRepo.save = jest.fn().mockResolvedValue(mockProperty)

  const result = await service.createProperty(newProperty as any);
  expect(result).toEqual(mockProperty);
  expect(propertyRepo.create).toHaveBeenCalledWith(newProperty);
  expect(propertyRepo.save).toHaveBeenCalledWith(mockProperty);
  })

it('should update a property based on id', async () => {
  const updatedProperty = { ...mockProperty, City: 'New city' };
  const updateData = { City: 'New city' };

  
  propertyRepo.findOneBy = jest.fn().mockResolvedValue(mockProperty);

  propertyRepo.save = jest.fn().mockResolvedValue(updatedProperty);

  const result = await service.updatePropertyById(mockProperty.id, updateData as any);

  expect(propertyRepo.findOneBy).toHaveBeenCalledWith({ id: mockProperty.id });
  expect(propertyRepo.save).toHaveBeenCalledWith({ ...mockProperty, ...updateData });
  expect(result.City).toEqual('New city');
});
it('should throw error if property to update is not found', async () => {
  propertyRepo.findOneBy = jest.fn().mockResolvedValue(null);

  await expect(
    service.updatePropertyById(mockProperty.id, { City: 'Nothing' } as any)
  ).rejects.toThrow('Property not found');
});

it('should delete property by id', async () => {
  propertyRepo.delete = jest.fn().mockResolvedValue({ affected: 1 });

  await expect(service.deletePropertyById(mockProperty.id)).resolves.toBeUndefined();
  expect(propertyRepo.delete).toHaveBeenCalledWith(mockProperty.id);
});

it('should throw error if property not found or already deleted', async () => {
  propertyRepo.delete = jest.fn().mockResolvedValue({ affected: 0 });

  await expect(service.deletePropertyById(mockProperty.id))
    .rejects
    .toThrow('Property not found or already deleted');

  expect(propertyRepo.delete).toHaveBeenCalledWith(mockProperty.id);
});
})