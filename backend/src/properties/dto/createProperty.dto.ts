import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreatePropertyDto{
    @IsString()
    @IsNotEmpty()
    City: string;

    @IsString()
    @IsNotEmpty()
    Address: string;

    @IsString()
    @IsNotEmpty()
    ZipCode: string;

    @IsString()
    @IsNotEmpty()
    Property_Type: string;

    @IsString()
    @IsNotEmpty()
    Price: string;

    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    Square_Feet: number;

    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    Beds: number;

    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    Bathrooms: number;

    @IsString()
    Features: string;

    @IsString()
    @IsNotEmpty()
    Listing_Type: string;
}