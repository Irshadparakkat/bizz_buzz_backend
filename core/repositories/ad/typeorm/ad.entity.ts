import { EAdStat } from 'core/repositories/adStat/typeorm/adStat.entity';
import { EBusiness } from 'core/repositories/business/typeorm/business.entity';
import { EFavouriteAd } from 'core/repositories/favouriteAd/typeorm/favouriteAd.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'ad' })
export class EAd {
  @PrimaryGeneratedColumn()
  adId: number;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column({ default: new Date() })
  validFrom: Date;

  @Column({ default: new Date() })
  validTo: Date;

  @Column({ default: 1000 })
  adRange: number;

  @Column({ default: 'active' })
  status?: string;

  @Column()
  adUrl: string;

  @Column()
  thumbnailUrl: string;

  @Column()
  sqrThumbnailUrl: string;

  @ManyToOne(() => EBusiness, (business) => business.ad, {})
  @JoinColumn({ name: 'businessId' })
  business?: EBusiness;

  @OneToMany(() => EAdStat, (adstat) => adstat.ad)
  adStat?: EAdStat[];

  @OneToMany(() => EFavouriteAd, (favouriteAd) => favouriteAd.ad)
  favouriteAd?: EFavouriteAd[];

  distance?: number;

  liked?: boolean;

  @CreateDateColumn()
  createdTime: Date;

  @UpdateDateColumn()
  updatedTime: Date;

  @DeleteDateColumn()
  deletedTime?: Date;
}
