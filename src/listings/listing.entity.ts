import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { ListingStatus } from './listing-status.enum';
import { User } from 'src/auth/user.entity';

// type Image = {
//   fileName: string;
// }

// type Location = {
//   latitude: number;
//   longitude: number; 
// }

@Entity()
export class Listing extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;
  
  // @Column()
  // images: Image[];

  @Column()
  price: number;

  @Column()
  quantity: number;

  @Column()
  status: ListingStatus;

  @ManyToOne(type => User, user => user.listings, { eager: false })
  user: User;

  @Column()
  userId: number;

  @Column()
  categoryId: number;

  // @Column()
  // location: Location;
}