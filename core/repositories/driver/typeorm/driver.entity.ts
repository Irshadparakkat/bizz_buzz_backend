import { EBus } from 'core/repositories/bus/typeorm/bus.entity';
import { EJourney } from 'core/repositories/journey/typeorm/journey.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';

@Entity({ name: 'driver' })
export class EDriver {
  @PrimaryGeneratedColumn()
  driverId: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column()
  password: string;

  @Column()
  phoneNumber: string;

  @Column()
  status: string;

  @Column({ default: 'driver' })
  role: string;

  @Column()
  bloodGroup?: string;

  @Column({ default: 'No' })
  donationStatus?: string;

  @ManyToMany(() => EBus, (bus) => bus.driver, { cascade: true })
  bus: EBus[];

  @OneToMany(() => EJourney, (journey) => journey.driver, {})
  journey: EJourney[];

  @Column({ nullable: true })
  otp: string;

  @CreateDateColumn()
  createdTime: Date;

  @UpdateDateColumn()
  updatedTime: Date;

  @DeleteDateColumn()
  deletedTime: Date;
}
