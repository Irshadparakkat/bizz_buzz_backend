import { Injectable } from '@nestjs/common';
import { BasePostgreSQLRepository } from '../base.postgresql.repository';
import { IAd } from 'core/entities/ad/ad.interface';
import { EAd } from './typeorm/ad.entity';
import { AdRepositoryInterface } from './ad.repository.interface';
import { Brackets } from 'typeorm';
import { BusinessRepositoryInterface } from '../business/business.repository.interface';
import { BusinessPostgreSQLRepository } from '../business/business.postgresql.repository';
import { LocationService } from 'shared/service/location.service';

@Injectable()
export class AdPostgreSQLRepository
  extends BasePostgreSQLRepository
  implements AdRepositoryInterface {
  private businessRepository: BusinessRepositoryInterface =
    new BusinessPostgreSQLRepository();

  private locationService: LocationService = new LocationService();

  async add(ad: IAd): Promise<IAd> {
    await this.init();
    const repository = this.dataSource().getRepository(EAd);
    const generatedEntity = await repository.save(this.toEntity(ad));
    return this.fromEntity(generatedEntity);
  }

  async find(adId: number): Promise<IAd | undefined> {
    await this.init();
    const repository = this.dataSource().getRepository(EAd);
    const entity = await repository.findOne({ where: { adId } });
    if (!entity) {
      return undefined;
    }
    return this.fromEntity(entity);
  }

  async search(
    where: Partial<IAd> | Partial<IAd>[] = {},
    limit?: number,
    offset?: number,
    latitude?: number,
    longitude?: number,
    busAd?: boolean
  ): Promise<IAd[]> {
    const queryBuilder = await this.getQuery(where, latitude, longitude, busAd);

    const entity = await queryBuilder.skip(offset).take(limit).getMany();
    return entity.map((ad) => this.fromEntity(ad, latitude, longitude));
  }

  async count(
    where: Partial<IAd> = {},
    latitude?: number,
    longitude?: number,
    busAd?: boolean
  ): Promise<number> {
    const queryBuilder = await this.getQuery(where, latitude, longitude, busAd);
    return await queryBuilder.getCount();
  }

  async getQuery(
    input: Partial<IAd> | Partial<IAd>[] = {},
    latitude?: number,
    longitude?: number,
    busAd?: boolean
  ) {
    await this.init();
    const repository = this.dataSource().getRepository(EAd);
    const queryBuilder = await repository.createQueryBuilder('ad');
    queryBuilder.leftJoinAndSelect('ad.business', 'business');
    if (!Array.isArray(input) && input?.customerId) {
      queryBuilder.leftJoinAndSelect(
        'ad.favouriteAd',
        'favouriteAd',
        `favouriteAd.customerId = ${input?.customerId}`,
      );
    }
    queryBuilder.where('ad.deletedTime IS NULL');
    if (Array.isArray(input) && input.length > 0) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          input.forEach((where, index) => {
            const condition = this.getSingleWhere(qb, where);
            if (condition) {
              if (index > 0) {
                qb.orWhere(condition);
              } else {
                qb.where(condition);
              }
            }
          });
        }),
      );
    } else if (typeof input === 'object' && Object.keys(input).length > 0) {
      const condition = this.getSingleWhere(
        queryBuilder,
        input as Partial<IAd>,
      );
      condition && queryBuilder.andWhere(condition);
    }

    if (latitude && longitude && busAd === false) {
      queryBuilder.andWhere("ad.status = 'active'");
      queryBuilder.andWhere(
        '(ad.validFrom <= :currentTime AND ad.validTo >= :currentTime)',
      );
      queryBuilder.addSelect(
        `(
              6371 * acos(
                  cos(radians(${latitude})) * cos(radians(business.latitude)) *
                  cos(radians(business.longitude) - radians(${longitude})) +
                  sin(radians(${latitude})) * sin(radians(business.latitude))
              )
          )`, // in meeters
        'distance',
      );
      queryBuilder.andWhere(`(
          6371 * acos(
              cos(radians(${latitude})) * cos(radians(business.latitude)) *
              cos(radians(business.longitude) - radians(${longitude})) +
              sin(radians(${latitude})) * sin(radians(business.latitude))
          )
      ) < ad.adRange`);
      queryBuilder.setParameter('currentTime', new Date());
      queryBuilder.orderBy('distance', 'ASC');
    }
    if (latitude && longitude && busAd === true) {
      queryBuilder.andWhere("ad.status = 'active'");
      queryBuilder.andWhere(
        '(ad.validFrom <= :currentTime AND ad.validTo >= :currentTime)',
      );

      // Distance calculation using Haversine formula
      const distanceExpression = `(
        6371 * acos(
          cos(radians(${latitude})) * cos(radians(business.latitude)) *
          cos(radians(business.longitude) - radians(${longitude})) +
          sin(radians(${latitude})) * sin(radians(business.latitude))
        )
      ) * 1000`; // in meters

      // Select the distance for ordering and filtering
      queryBuilder.addSelect(distanceExpression, 'distance');

      // Ensure the ad is within the ad range
      queryBuilder.andWhere(`${distanceExpression} < ad.adRange`);

      queryBuilder.setParameter('currentTime', new Date());
      queryBuilder.orderBy('distance', 'ASC');

      // Optional: Add logging to debug distance calculation
      console.log('Calculated distance:', distanceExpression);
    }
    return queryBuilder;
  }

  private getSingleWhere(queryBuilder, where: Partial<IAd>) {
    const conditions = [];

    if (where.name) {
      conditions.push('ad.name ILIKE :name');
      queryBuilder.setParameter('name', this.toWildcard(where.name));
    }
    if (where.status) {
      conditions.push('ad.status = :status');
      queryBuilder.setParameter('status', where.status);
    }
    if (where.adId) {
      conditions.push('ad.adId = :adId');
      queryBuilder.setParameter('adId', where.adId);
    }
    if (where.category) {
      conditions.push('ad.category = :category');
      queryBuilder.setParameter('category', where.category);
    }
    if (where.business) {
      if (where.business.businessId) {
        conditions.push('business.businessId = :businessId');
        queryBuilder.setParameter('businessId', where.business.businessId);
      }
      if (where.business.name) {
        conditions.push('business.name ILIKE :businessName');
        queryBuilder.setParameter(
          'businessName',
          this.toWildcard(where.business.name),
        );
      }
    }

    return conditions.join(' AND ');
  }

  private toWildcard(value: string): string {
    const lowercaseValue = value.toLowerCase();
    return lowercaseValue.replaceAll('*', '%');
  }

  async update(adId: number, fields: Partial<IAd>): Promise<IAd | undefined> {
    await this.init();
    const repository = this.dataSource().getRepository(EAd);
    await repository.update({ adId }, this.toPartialEntity(fields));
    return this.find(adId);
  }

  async delete(adId: number): Promise<boolean> {
    await this.init();
    const repository = this.dataSource().getRepository(EAd);
    await repository.softDelete({ adId });
    return true;
  }

  public toEntity(input: IAd): EAd {
    const output = new EAd();
    output.adId = input.adId;
    output.name = input.name;
    output.category = input.category;
    output.validFrom = input.validFrom;
    output.validTo = input.validTo;
    output.status = input.status;
    output.adRange = input.adRange;
    output.adUrl = input.adUrl;
    output.thumbnailUrl = input.thumbnailUrl;
    output.sqrThumbnailUrl = input.sqrThumbnailUrl;
    output.createdTime = input.createdTime;
    output.business =
      input.business && this.businessRepository.toEntity(input.business);
    return output;
  }

  private toPartialEntity(input: Partial<IAd>): Partial<EAd> {
    const output = new EAd();
    output.adId = input?.adId;
    output.name = input?.name;
    output.category = input?.category;
    output.validFrom = input?.validFrom;
    output.validTo = input?.validTo;
    output.status = input?.status;
    output.adRange = input?.adRange;
    output.adUrl = input?.adUrl;
    output.thumbnailUrl = input?.thumbnailUrl;
    output.sqrThumbnailUrl = input?.sqrThumbnailUrl;
    output.createdTime = input?.createdTime;
    return output;
  }

  public fromEntity(input: EAd, latitude?: number, longitude?: number): IAd {
    return {
      adId: input.adId,
      name: input.name,
      category: input.category,
      validFrom: input.validFrom,
      validTo: input.validTo,
      status: input.status,
      adRange: input.adRange,
      adUrl: input.adUrl,
      distance:
        latitude &&
        longitude &&
        input.business?.latitude &&
        input.business?.longitude &&
        this.locationService.getDistance(
          input.business.latitude,
          input.business.longitude,
          latitude,
          longitude,
        ),
      thumbnailUrl: input.thumbnailUrl,
      sqrThumbnailUrl: input.sqrThumbnailUrl,
      createdTime: input.createdTime,
      business:
        input.business && this.businessRepository.fromEntity(input.business),
      liked:
        input.liked === undefined ? input.favouriteAd?.length > 0 : input.liked,
    };
  }
}
