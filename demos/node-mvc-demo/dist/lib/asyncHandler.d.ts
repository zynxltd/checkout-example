import type { NextFunction, Request, Response, RequestHandler } from 'express';
export declare function asyncHandler(handler: (req: Request, res: Response, next: NextFunction) => Promise<void>): RequestHandler;
