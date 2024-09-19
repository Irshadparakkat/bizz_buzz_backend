import { Response } from 'express';

export class ListOutput<T> {
  public async list(
    res: Response,
    entities: T[],
    envelop: string,
    offset: number,
    limit: number,
    total: number,
  ): Promise<any> {
    return res.json({
      status: true,
      data: {
        [envelop]: entities,
      },
      pagination: {
        offset,
        limit,
        total,
      },
    });
  }

  public async customList(
    res: Response,
    entities: T[],
    envelop: string,
    customFieldEnvelop: string,
    customField: string,
  ): Promise<any> {
    return res.json({
      status: true,
      data: {
        [envelop]: [entities],
        [customFieldEnvelop]: customField,
      },
    });
  }
}
