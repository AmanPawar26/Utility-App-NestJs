import { Test, TestingModule } from '@nestjs/testing';
import { PropertiesService } from './properties.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Properties } from './properties.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { find } from 'rxjs';


describe('PropertiesService', () => {
  let service: PropertiesService;
  let repository: Repository<Properties>;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Properties],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Properties]),
      ],
      providers: [PropertiesService],
    }).compile();

    service = module.get<PropertiesService>(PropertiesService);
    repository = module.get<Repository<Properties>>(getRepositoryToken(Properties));
  });

  // it('should be defined', () => {
  //   expect(service).toBeDefined();
  // });

  describe.only('GetAll Properties service', () => {
    it('Should return all properties', async () => {
      // Arrange
      await repository.save([
        {
          City: 'Sample City A',
          Address: 'Sample Address',
          ZipCode: '123',
          Property_Type: 'Condo',
          Price: '123',
          Square_Feet: 1600,
          Beds: 2,
          Bathrooms: 5,
          Features: "Sample features",
          Listing_Type: "Rent",
        },
        {
          City: 'Sample City B',
          Address: 'Address',
          ZipCode: '129',
          Property_Type: 'Single-Family',
          Price: '12389',
          Square_Feet: 15090,
          Beds: 7,
          Bathrooms: 4,
          Features: "Sample features good",
          Listing_Type: "Buy",
        },
      ])

      //act
      const result = await service.getAllProperties();
      expect(result.length).toBe(2);
      expect(result[0].City).toBe('Sample City A')
      expect(result[1].City).toBe('Sample City B')
    });
  })
  describe('Get property by Id', () => {
    // Arrange
    it('Should return a property by id', async () => {
      await repository.save([
        {
          id: 1,
          City: "City Id",
          Address: "Id Address",
          ZipCode: '890',
          Property_Type: 'Townhouse',
          Price: '8900',
          Square_Feet: 4567,
          Beds: 2,
          Bathrooms: 6,
          Features: "Id features",
          Listing_Type: "Rent"
        }
      ]);

      // act
      const result = await service.getPropertyById(1)

      // assert
      expect(result.id).toBe(1);
    })
  })

  describe('Get property By City', () => {
    it('Should return a property based on a city', async () => {
      await repository.save([
        {
          City: 'Mumbai',
          Address: "City Address",
          ZipCode: '890',
          Property_Type: 'Townhouse',
          Price: '8900',
          Square_Feet: 4567,
          Beds: 2,
          Bathrooms: 6,
          Features: "City features",
          Listing_Type: "Rent"
        },
        {
          City: 'Mumbai',
          Address: "City Address",
          ZipCode: '890',
          Property_Type: 'Townhouse',
          Price: '8900',
          Square_Feet: 4567,
          Beds: 2,
          Bathrooms: 6,
          Features: "City features",
          Listing_Type: "Rent"
        }
      ]);

      // act
      const result = await service.getPropertyByCity('Mumbai');

      //assert
      expect(result).toHaveLength(2);
      expect(result[0].City).toEqual('Mumbai');
      expect(result[1].City).toEqual('Mumbai');

    })
  })

  describe('Create a new property', () => {
    it('Should notify if user is created', async () => {
      const newProperty =
      {
        id: 3,
        City: 'Mumbai',
        Address: "City Address",
        ZipCode: '890',
        Property_Type: 'Townhouse',
        Price: '8900',
        Square_Feet: 4567,
        Beds: 2,
        Bathrooms: 6,
        Features: "City features",
        Listing_Type: "Rent"
      }

      const result = await service.createProperty(newProperty);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
    })
  })

  describe('Update a property by Id', () => {
  it('Should update a property based on id', async () => {
    const prId = 2;

    
    await repository.save({
      id: prId,
      City: 'Mumbai',
      Address: "City Address",
      ZipCode: '890',
      Property_Type: 'Townhouse',
      Price: '8900',
      Square_Feet: 4567,
      Beds: 2,
      Bathrooms: 6,
      Features: "City features",
      Listing_Type: "Rent"
    });

    // New updated values
    const updatedProp = {
      City: 'New Mumbai',
      Address: "City New",
      ZipCode: '890',
      Property_Type: 'Townhouse',
      Price: '8900',
      Square_Feet: 4567,
      Beds: 2,
      Bathrooms: 6,
      Features: "New features",
      Listing_Type: "Rent"
    };

    
    const result = await service.updatePropertyById(prId, updatedProp);

    
    expect(result).toBeDefined();
    expect(result.City).toBe('New Mumbai');
    expect(result.Address).toBe('City New');

  });
});

describe('Delete a property by Id', ()=>{
  it('Should notify if property is deleted', async()=>{
    await repository.save([
      {
        id: 1,
      City: 'New Mumbai',
      Address: "City New",
      ZipCode: '890',
      Property_Type: 'Townhouse',
      Price: '8900',
      Square_Feet: 4567,
      Beds: 2,
      Bathrooms: 6,
      Features: "New features",
      Listing_Type: "Rent"
      }
    ])
    await service.deletePropertyById(1);
    
    const deleted = await repository.findOneBy({ id: 1 });
    expect(deleted).toBeNull();
    
  })
})
});
