import db from '../models';
import { NextFunction, Request, Response } from 'express';


export async function getUsers(req: Request, res: Response) {
  try {
    const users = await db.User.findAll();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};