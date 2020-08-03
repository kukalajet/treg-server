import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { ProductStatus } from './listing-status.enum';
import { User } from 'src/auth/user.entity';

@Entity()
export class Product extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;
  
  @Column()
  status: ProductStatus

  @ManyToOne(type => User, user => user.products, { eager: false })
  user: User

  @Column()
  userId: number;
}