import { Response } from 'express';

export class ErrorOutput {
  public async notFound(res: Response, msg: string): Promise<any> {
    return res.status(404).json({
      status: false,
      message: [`The ${msg} cannot be found`],
    });
  }

  public async unauthorized(res: Response): Promise<any> {
    return res.status(403).json({
      status: false,
      message: ['You are not allowed to perform this action'],
    });
  }

  public async serverError(res: Response): Promise<any> {
    return res.status(500).json({
      status: false,
      message: ['Server error'],
    });
  }

  public async badRequestError(
    res: Response,
    messages: string[],
  ): Promise<any> {
    return res.status(400).json({
      status: false,
      message: messages,
    });
  }

  public async customError(res: Response, msg: string): Promise<any> {
    return res.status(403).json({
      status: false,
      message: [msg],
    });
  }
}
