import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'setting' })
export class ESetting {

  @PrimaryColumn({default: 1 })
  settingId: number = 1;

  @Column({ default: 1000 })
  minConversionPoints: number;

  @Column({ default: 1000 })
  minClaimPoints: number;

  @Column({ default: 50 })
  rewardExpiryInDays: number;

  @Column({ default: 1000 })
  fullAdWatchedPoints: number;

  @Column({ default: 200 })
  fiveSecAdWatchedPoints: number;

  @CreateDateColumn()
  createdTime: Date;

  @UpdateDateColumn()
  updatedTime: Date;

  @DeleteDateColumn()
  deletedTime: Date;
}