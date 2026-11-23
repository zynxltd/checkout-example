import type { Request, Response } from 'express';
export declare function show(req: Request, res: Response): Promise<void>;
export declare function enqueueDemoJob(req: Request, res: Response): void;
export declare function enqueueQuoteDigest(req: Request, res: Response): void;
