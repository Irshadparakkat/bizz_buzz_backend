import { Inject, Injectable } from '@nestjs/common';
import { IAd } from 'core/entities/ad/ad.interface';
import { v2 as cloudinary } from 'cloudinary';
import { AdRepositoryInterface } from 'core/repositories/ad/ad.repository.interface';

@Injectable()
export class AdService {
  constructor(
    @Inject('AdRepository')
    private repository: AdRepositoryInterface,
  ) {}

  async uploadToCloudinary(base64: string): Promise<string> {
    try {
      const result = await cloudinary.uploader.upload(base64, {
        resource_type: 'auto',
      });
      return result.secure_url;
    } catch (error) {
      throw new Error('Failed to upload to Cloudinary');
    }
  }

  async createAd(body: IAd): Promise<IAd> {
    const adUrl = await this.uploadToCloudinary(body.adUrl);
    const thumbnailUrl = await this.uploadToCloudinary(body.thumbnailUrl);
    const sqrThumbnailUrl = await this.uploadToCloudinary(body.sqrThumbnailUrl);

    const ad: IAd = {
      ...body,
      adUrl,
      thumbnailUrl,
      sqrThumbnailUrl,
    };
    return await this.repository.add(ad);
  }

  async showAd(adId: number): Promise<IAd | undefined> {
    return await this.repository.find(adId);
  }

  async listAd(
    where?: Partial<IAd> | Partial<IAd>[],
    limit?: number,
    offset?: number,
    latitude?: number,
    longitude?: number,
  ) {
    return await this.repository.search(
      where,
      limit,
      offset,
      latitude,
      longitude,
    );
  }

  async count(
    where?: Partial<IAd> | Partial<IAd>[],
    latitude?: number,
    longitude?: number,
  ): Promise<number> {
    return await this.repository.count(where, latitude, longitude);
  }

  async updateAd(adId: number, body: Partial<IAd>): Promise<IAd | undefined> {
    return await this.repository.update(adId, body);
  }

  async deleteAd(adId: number): Promise<boolean> {
    return await this.repository.delete(adId);
  }
}
