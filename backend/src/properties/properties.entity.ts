import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity('Properties')
export class Properties {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  City: string;

  @Column({ type: 'text' })
  Address: string;

  @Column({ type: 'text' })
  ZipCode: string;

  @Column({ type: 'text' })
  Property_Type: string;

  @Column({ type: 'text' })
  Price: string;

  @Column({ type: 'integer' })
  Square_Feet: number;

  @Column({ type: 'integer' })
  Beds: number;

  @Column({ type: 'integer' })
  Bathrooms: number;

  @Column({ type: 'text' })
  Features: string;

  @Column({ type: 'text' })
  Listing_Type: string;
}
