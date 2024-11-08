import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logError, logWarning, logInfo } from '../utils/logger';
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.JWT_SECRET!;

export const jwtVerificationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  // Get token from 'Authorization' header in 'Bearer <token>' format
  const authHeader = req.headers['authorization'];
  const token =
    authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;

  if (!token) {
    logWarning('No token provided in the request');
    return res
      .status(403)
      .send({ success: false, message: 'No token provided.' });
  }

  jwt.verify(token, secret, (err: any, decoded: any) => {
    if (err) {
      logError(`Failed to authenticate token: ${err.message}`);
      return res.status(403).send({
        success: false,
        message:
          'Failed to authenticate token. Please include the token returned from login as a Bearer token',
      });
    } else {
      (req as any).username = decoded.username;
      (req as any).orgname = decoded.orgName;
      logInfo(
        `Decoded from JWT token: username - ${decoded.username}, orgname - ${decoded.orgName}`
      );
      next();
    }
  });
};
