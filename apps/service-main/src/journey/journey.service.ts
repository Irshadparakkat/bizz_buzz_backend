import { Inject, Injectable } from '@nestjs/common';
import { IJourney } from 'core/entities/journey/journey.interface';
import { JourneyRepositoryInterface } from 'core/repositories/journey/journey.repository.interface';

@Injectable()
export class JourneyService {
  constructor(
    @Inject('JourneyRepository')
    private respository: JourneyRepositoryInterface,
  ) {}

  async createJourney(body: IJourney): Promise<IJourney> {
    return await this.respository.add(body);
  }

  async showJourney(journeyId: number): Promise<IJourney | undefined> {
    return await this.respository.find(journeyId);
  }

  async listJourney(
    where?: Partial<IJourney>,
    limit?: number,
    offset?: number,
  ): Promise<IJourney[]> {
    return await this.respository.search(where, limit, offset);
  }

  async count(where?: Partial<IJourney>): Promise<number> {
    return await this.respository.count(where);
  }

  async updateJourney(
    journeyId: number,
    body: Partial<IJourney>,
  ): Promise<IJourney | undefined> {
    return await this.respository.update(journeyId, body);
  }

  async deleteJourney(journeyId: number): Promise<boolean> {
    return await this.respository.delete(journeyId);
  }
}
