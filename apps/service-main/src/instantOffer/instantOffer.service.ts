import { Inject, Injectable } from '@nestjs/common';
import { IInstantOffer } from 'core/entities/instantOffer/instantOffer.interface';
import { InstantOfferRepositoryInterface } from 'core/repositories/instantOffer/instantOffer.repository.interface';

@Injectable()
export class InstantOfferService {
  constructor(
    @Inject('InstantOfferRepository')
    private respository: InstantOfferRepositoryInterface,
  ) {}

  async createInstantOffer(body: IInstantOffer): Promise<IInstantOffer> {
    return await this.respository.add(body);
  }

  async showInstantOffer(
    instantOfferId: number,
  ): Promise<IInstantOffer | undefined> {
    return await this.respository.find(instantOfferId);
  }

  async listInstantOffer(
    where?: Partial<IInstantOffer>,
    limit?: number,
    offset?: number,
  ) {
    return await this.respository.search(where, limit, offset);
  }

  async count(where?: Partial<IInstantOffer>): Promise<number> {
    return await this.respository.count(where);
  }

  async updateInstantOffer(
    instantOfferId: number,
    body: Partial<IInstantOffer>,
  ): Promise<IInstantOffer | undefined> {
    return await this.respository.update(instantOfferId, body);
  }

  async deleteInstantOffer(instantOfferId: number): Promise<boolean> {
    return await this.respository.delete(instantOfferId);
  }
}
