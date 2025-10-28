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

export async function getFilterOptions(req: Request, res: Response) {
  try {
    // Get distinct chain names
    const chains = await db.POI.findAll({
      attributes: [[db.sequelize.fn('DISTINCT', db.sequelize.col('chain_name')), 'chain_name']],
      where: {
        chain_name: { [Op.not]: null }
      },
      order: [['chain_name', 'ASC']],
      raw: true,
    });

    // Get distinct DMAs
    const dmas = await db.POI.findAll({
      attributes: [[db.sequelize.fn('DISTINCT', db.sequelize.col('dma')), 'dma']],
      where: {
        dma: { [Op.not]: null }
      },
      order: [['dma', 'ASC']],
      raw: true,
    });

    // Get distinct categories
    const categories = await db.POI.findAll({
      attributes: [[db.sequelize.fn('DISTINCT', db.sequelize.col('sub_category')), 'sub_category']],
      where: {
        sub_category: { [Op.not]: null }
      },
      order: [['sub_category', 'ASC']],
      raw: true,
    });

    res.json({
      chains: chains.map((c: any) => c.chain_name),
      dmas: dmas.map((d: any) => d.dma),
      categories: categories.map((c: any) => c.sub_category),
    });
  } catch (error) {
    console.error('Error fetching filter options:', error);
    res.status(500).json({ error: 'Failed to fetch filter options' });
  }
}
