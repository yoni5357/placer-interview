import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Define the attributes interface
interface POIAttributes {
  id: number;
  entity_id: string;
  entity_type: string | null;
  name: string | null;
  foot_traffic: number;
  sales: number;
  avg_dwell_time_min: number | null;
  area_sqft: number | null;
  ft_per_sqft: number | null;
  geolocation: string | null;
  country: string | null;
  state_code: string | null;
  state_name: string | null;
  city: string | null;
  postal_code: string | null;
  formatted_city: string | null;
  street_address: string | null;
  sub_category: string | null;
  dma: string | null;
  cbsa: string | null;
  chain_id: string | null;
  chain_name: string | null;
  store_id: string | null;
  date_opened: Date | null;
  date_closed: Date | null;
}

// Optional attributes for creation (id is auto-generated)
interface POICreationAttributes extends Optional<POIAttributes, 'id'> {}

// Extend the Model class
class POI extends Model<POIAttributes, POICreationAttributes> implements POIAttributes {
  public id!: number;
  public entity_id!: string;
  public entity_type!: string | null;
  public name!: string | null;
  public foot_traffic!: number;
  public sales!: number;
  public avg_dwell_time_min!: number | null;
  public area_sqft!: number | null;
  public ft_per_sqft!: number | null;
  public geolocation!: string | null;
  public country!: string | null;
  public state_code!: string | null;
  public state_name!: string | null;
  public city!: string | null;
  public postal_code!: string | null;
  public formatted_city!: string | null;
  public street_address!: string | null;
  public sub_category!: string | null;
  public dma!: string | null;
  public cbsa!: string | null;
  public chain_id!: string | null;
  public chain_name!: string | null;
  public store_id!: string | null;
  public date_opened!: Date | null;
  public date_closed!: Date | null;

  // Virtual property for open/closed status
  get is_open(): boolean {
    return this.date_closed === null;
  }
}

// Initialize the model
POI.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    entity_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    entity_type: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    foot_traffic: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    sales: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    avg_dwell_time_min: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    area_sqft: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    ft_per_sqft: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    geolocation: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    state_code: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    state_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    postal_code: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    formatted_city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    street_address: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    sub_category: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    dma: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    cbsa: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    chain_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    chain_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    store_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    date_opened: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    date_closed: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'pois',
    timestamps: false,
    freezeTableName: true,
  }
);

export default POI;
