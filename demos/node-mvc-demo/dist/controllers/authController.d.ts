import type { Request, Response } from 'express';
export declare function show(req: Request, res: Response): void;
export declare function submit(req: Request, res: Response): void;
export declare function logout(req: Request, res: Response, next: (err?: unknown) => void): void;
