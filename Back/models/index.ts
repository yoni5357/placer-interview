import sequelize from '../config/database';
import User from './User';

// Database instance and models
const db = {
  sequelize,
  User,
};

// Test connection
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connected successfully');
    return true;
  } catch (error) {
    console.error('✗ Unable to connect to database:', error);
    return false;
  }
};

export default db;
