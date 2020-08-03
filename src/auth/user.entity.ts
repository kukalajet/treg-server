import { BaseEntity, Entity, Unique, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import * as bcrypt from 'bcryptjs';
import { Product } from "src/listings/listing.entity";

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  salt: string;
  
  @Column('float')
  longitude: number;  // TODO: To be changed for the best solution.

  @Column('float')
  latitude: number;

  @OneToMany(type => Product, product => product.user, { eager: true })
  products: Product[];

  public async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}