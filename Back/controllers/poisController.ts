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

    // Debug logging
    console.log('Request query params:', req.query);

    // Build dynamic WHERE clause based on filters
    const where: any = {};

    // Helper function to handle multiple values (OR logic)
    const addFilter = (field: string, queryParam: any, usePartialMatch = false) => {
      if (!queryParam) return;
      
      if (Array.isArray(queryParam)) {
        // For multiple values, use IN or LIKE depending on partial match
        if (usePartialMatch) {
          where[field] = {
            [Op.or]: queryParam.map(val => ({ [Op.like]: `%${val}%` }))
          };
        } else {
          where[field] = { [Op.in]: queryParam };
        }
      } else {
        // Single value - use LIKE for partial match, exact match otherwise
        where[field] = usePartialMatch ? { [Op.like]: `%${queryParam}%` } : queryParam;
      }
    };

    addFilter('chain_name', req.query.chain_name);
    addFilter('sub_category', req.query.category);
    addFilter('dma', req.query.dma);
    addFilter('city', req.query.city);
    addFilter('state_name', req.query.state || req.query.state_name);
    addFilter('state_code', req.query.state_code);
    addFilter('name', req.query.name);
    addFilter('street_address', req.query.street_address, true); // Use partial match for address

    // Open/closed status filter
    if (req.query.is_open !== undefined) {
      const isOpen = req.query.is_open === 'true';
      where.date_closed = isOpen ? null : { [Op.not]: null };
    }

    // Debug logging
    console.log('WHERE clause:', JSON.stringify(where, null, 2));

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

export async function autocomplete(req: Request, res: Response) {
  try {
    const query = (req.query.q as string || '').trim();
    
    // Require at least 2 characters
    if (query.length < 2) {
      return res.json({ results: [] });
    }
    
    const searchPattern = `%${query}%`;
    
    // Search across multiple fields and combine results
    const results: any[] = [];
    
    // Search POI names
    const names = await db.POI.findAll({
      attributes: ['name'],
      where: {
        name: { [Op.like]: searchPattern, [Op.not]: null }
      },
      limit: 5,
      raw: true,
    });
    names.forEach((n: any) => {
      if (n.name) {
        results.push({
          value: n.name,
          field: 'name',
          fieldLabel: 'Name'
        });
      }
    });
    
    // Search chain names
    const chains = await db.POI.findAll({
      attributes: [[db.sequelize.fn('DISTINCT', db.sequelize.col('chain_name')), 'chain_name']],
      where: {
        chain_name: { [Op.like]: searchPattern, [Op.not]: null }
      },
      limit: 5,
      raw: true,
    });
    chains.forEach((c: any) => {
      if (c.chain_name) {
        results.push({
          value: c.chain_name,
          field: 'chain_name',
          fieldLabel: 'Chain'
        });
      }
    });
    
    // Search state names
    const stateNames = await db.POI.findAll({
      attributes: [[db.sequelize.fn('DISTINCT', db.sequelize.col('state_name')), 'state_name']],
      where: {
        state_name: { [Op.like]: searchPattern, [Op.not]: null }
      },
      limit: 3,
      raw: true,
    });
    stateNames.forEach((s: any) => {
      if (s.state_name) {
        results.push({
          value: s.state_name,
          field: 'state_name',
          fieldLabel: 'State'
        });
      }
    });
    
    // Search state codes
    const stateCodes = await db.POI.findAll({
      attributes: [[db.sequelize.fn('DISTINCT', db.sequelize.col('state_code')), 'state_code']],
      where: {
        state_code: { [Op.like]: searchPattern, [Op.not]: null }
      },
      limit: 3,
      raw: true,
    });
    stateCodes.forEach((s: any) => {
      if (s.state_code) {
        results.push({
          value: s.state_code,
          field: 'state_code',
          fieldLabel: 'State Code'
        });
      }
    });
    
    // Search cities
    const cities = await db.POI.findAll({
      attributes: [[db.sequelize.fn('DISTINCT', db.sequelize.col('city')), 'city']],
      where: {
        city: { [Op.like]: searchPattern, [Op.not]: null }
      },
      limit: 3,
      raw: true,
    });
    cities.forEach((c: any) => {
      if (c.city) {
        results.push({
          value: c.city,
          field: 'city',
          fieldLabel: 'City'
        });
      }
    });
    
    // Search addresses - extract street names without numbers
    const addresses = await db.POI.findAll({
      attributes: ['street_address'],
      where: {
        street_address: { [Op.like]: searchPattern, [Op.not]: null }
      },
      limit: 50, // Get more to process
      raw: true,
    });
    
    const streetNames = new Set<string>();
    addresses.forEach((a: any) => {
      if (a.street_address) {
        // Remove leading numbers and spaces to get just the street name
        // Examples: "1903 S Cedar St" -> "S Cedar St", "200 Columbus Corners Dr" -> "Columbus Corners Dr"
        const streetName = a.street_address.replace(/^\d+\s+/, '').trim();
        if (streetName && streetName.toLowerCase().includes(query.toLowerCase())) {
          streetNames.add(streetName);
        }
      }
    });
    
    // Convert Set to array and limit results
    Array.from(streetNames).slice(0, 5).forEach(streetName => {
      results.push({
        value: streetName,
        field: 'street_address',
        fieldLabel: 'Street'
      });
    });
    
    // Remove duplicates and limit to 15 results
    const uniqueResults = Array.from(
      new Map(results.map(item => [`${item.value}-${item.field}`, item])).values()
    ).slice(0, 15);
    
    res.json({ results: uniqueResults });
  } catch (error) {
    console.error('Error in autocomplete:', error);
    res.status(500).json({ error: 'Failed to perform autocomplete' });
  }
}
