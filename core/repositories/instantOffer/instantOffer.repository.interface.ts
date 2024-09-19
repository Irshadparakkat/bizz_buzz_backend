import { IInstantOffer } from "core/entities/instantOffer/instantOffer.interface";

export interface InstantOfferRepositoryInterface {

  add(instantOffer: IInstantOffer): Promise<IInstantOffer>;

  find(instantOfferId: number): Promise<IInstantOffer | undefined>

  search(where?: Partial<IInstantOffer>,  limit?: number, offset?: number): Promise<IInstantOffer[]>;

  update(instantOfferId: number, fields: Partial<IInstantOffer>,): Promise<IInstantOffer | undefined>;
  
  count(where?: Partial<IInstantOffer>): Promise<number>;

  delete(instantOfferId: number): Promise<boolean>;
}
