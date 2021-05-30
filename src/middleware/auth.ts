import fs from 'fs';
import path from "path";
import { promisify } from 'util';
import { Request, Response, NextFunction } from 'express';

export const validate = async (req: Request, res: Response, next: NextFunction) => {
  const readFile = promisify(fs.readFile);
  const authUsers = await readFile(path.resolve(__dirname, '../../.authorized'));
  if (req.session.email) {
    if (authUsers.includes(req.session.email)) {
      next()
      return
    }
  }
  res.redirect('/shawrty/login');
}
