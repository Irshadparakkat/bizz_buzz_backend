import { IJourney } from "core/entities/journey/journey.interface";

export interface JourneyRepositoryInterface {

  add(journey: IJourney): Promise<IJourney>;

  find(journeyId: number): Promise<IJourney | undefined>
  search(where?: Partial<IJourney>, limit?: number, offset?: number): Promise<IJourney[]>;
  count(where?: Partial<IJourney>): Promise<number>;

  update(journeyId: number, fields: Partial<IJourney>,): Promise<IJourney | undefined>;

  delete(journeyId: number): Promise<boolean>;
}
