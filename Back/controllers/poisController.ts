import db from '../models';
import { Request, Response } from 'express';
import { Op } from 'sequelize';

// TODO: maybe break into simple get and get summary
export async function getPOIs(req: Request, res: Response) {
  try {
    // Parse query parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    // Build dynamic WHERE clause based on filters
    const where: any = {};

    if (req.query.chain_name) {
      where.chain_name = req.query.chain_name;
    }

    if (req.query.category) {
      where.sub_category = req.query.category;
    }

    if (req.query.dma) {
      where.dma = req.query.dma;
    }

    if (req.query.city) {
      where.city = req.query.city;
    }

    if (req.query.state) {
      where.state_name = req.query.state;
    }

    // Open/closed status filter
    if (req.query.is_open !== undefined) {
      const isOpen = req.query.is_open === 'true';
      where.date_closed = isOpen ? null : { [Op.not]: null };
    }

    // Fetch paginated data with count
    const { count, rows } = await db.POI.findAndCountAll({
      where,
      limit,
      offset,
      order: [['name', 'ASC']],
    });

    // Calculate summary statistics for filtered results
    const summary = await db.POI.findOne({
      where,
      attributes: [
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'totalVenues'],
        [db.sequelize.fn('SUM', db.sequelize.col('foot_traffic')), 'totalFootTraffic'],
      ],
      raw: true,
    }) as any;

    // Response
    res.json({
      data: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
      summary: {
        totalVenues: parseInt(summary?.totalVenues || '0'),
        totalFootTraffic: parseInt(summary?.totalFootTraffic || '0'),
      },
    });
  } catch (error) {
    console.error('Error fetching POIs:', error);
    res.status(500).json({ error: 'Failed to fetch POIs' });
  }
}
