import { Response } from 'express';

export class SingleOutput<T> {
  public async single(
    res: Response,
    entity: T,
    envelop: string,
    created = false,
    bracket = true,
  ): Promise<any> {
    if (created) {
      return res.status(201).json({
        status: true,
        data: {
          [envelop]: [entity],
        },
      });
    }
    return res.status(200).json({
      status: true,
      data: {
        [envelop]: bracket == true ? [entity] : entity,
      },
    });
  }

  public async singleWithWarning(
    res: Response,
    entity: T,
    warnings: string[],
    envelop: string,
    created = false,
    bracket = true,
  ): Promise<any> {
    if (created) {
      return res.status(201).json({
        status: true,
        data: {
          [envelop]: [entity],
        },
      });
    }
    return res.status(200).json({
      status: true,
      warnings,
      data: {
        [envelop]: bracket == true ? [entity] : entity,
      },
    });
  }

  public async singleStatus(res: Response, status = false): Promise<any> {
    return res.status(201).json({
      status: status,
    });
  }

  public async delete(res: Response, deleted: boolean): Promise<any> {
    return res.status(200).json({
      status: true,
      data: {
        deleted,
      },
    });
  }
}
