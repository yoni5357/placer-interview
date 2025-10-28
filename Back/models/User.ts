import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Define the attributes interface
interface UserAttributes {
  id: number;
  username: string;
  password: string;
  role: string;
}

// Optional attributes for creation (id is auto-generated)
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

// Extend the Model class
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public username!: string;
  public password!: string;
  public role!: string;

  // Timestamps (if you add them later)
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the model
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user',
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: false, // Set to true if you add createdAt/updatedAt columns
    freezeTableName: true, // Prevent Sequelize from pluralizing table name
  }
);

export default User;
