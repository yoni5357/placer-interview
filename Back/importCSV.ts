import fs from 'fs';
import csv from 'csv-parser';
import db, { connectDB } from './models';

async function importCSV() {
  try {
    // Connect to database
    await connectDB();

    const pois: any[] = [];
    const filePath = '../docs/Bigbox Stores Metrics.csv';

    // Read CSV file
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        // Parse and transform the row
        pois.push({
          entity_id: row.entity_id,
          entity_type: row.entity_type || null,
          name: row.name || null,
          foot_traffic: parseInt(row.foot_traffic) || 0,
          sales: parseFloat(row.sales) || 0.00,
          avg_dwell_time_min: row.avg_dwell_time_min ? parseFloat(row.avg_dwell_time_min) : null,
          area_sqft: row.area_sqft ? parseFloat(row.area_sqft) : null,
          ft_per_sqft: row.ft_per_sqft ? parseFloat(row.ft_per_sqft) : null,
          geolocation: row.geolocation || null,
          country: row.country || null,
          state_code: row.state_code || null,
          state_name: row.state_name || null,
          city: row.city || null,
          postal_code: row.postal_code || null,
          formatted_city: row.formatted_city || null,
          street_address: row.street_address || null,
          sub_category: row.sub_category || null,
          dma: row.dma || null,
          cbsa: row.cbsa || null,
          chain_id: row.chain_id || null,
          chain_name: row.chain_name || null,
          store_id: row.store_id || null,
          date_opened: row.date_opened ? new Date(row.date_opened) : null,
          date_closed: row.date_closed ? new Date(row.date_closed) : null,
        });
      })
      .on('end', async () => {
        console.log(`Parsed ${pois.length} POIs from CSV`);

        // Bulk insert
        try {
          await db.POI.bulkCreate(pois, {
            ignoreDuplicates: true, // Skip duplicates based on unique entity_id
          });
          console.log('✓ Successfully imported POIs into database');
        } catch (error) {
          console.error('Error inserting POIs:', error);
        } finally {
          process.exit();
        }
      })
      .on('error', (error) => {
        console.error('Error reading CSV:', error);
        process.exit(1);
      });
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

importCSV();
