# POI Management & Analytics Platform

A full-stack application for browsing, filtering, and analyzing Points of Interest (POIs) with role-based access control and advanced search capabilities.

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **React Router** for navigation
- **Tailwind CSS** for styling

### Backend
- **Express** with TypeScript
- **Sequelize ORM** with MySQL
- **bcrypt** for password hashing
- **CORS** enabled for frontend communication
- **dotenv** for environment variables

### Database
- **MySQL** with Sequelize (no migrations)
- **889 POI records** imported from CSV

## Features

### 🔐 Authentication
- User registration with role selection (Guest/Client)
- Login with password hashing (bcrypt)
- Session management with localStorage
- Role-based UI restrictions

### 🗺️ POI Management
- Browse and filter POIs with pagination
- Multi-field filtering:
  - Chain Name
  - DMA (Designated Market Area)
  - Open/Closed Status
- Summary statistics (total POIs, open count, closed count)

### 🔍 Advanced Search
- Multi-field autocomplete search:
  - Name
  - Chain Name
  - State
  - City
  - Street Address
- Color-coded filter pills for visual clarity
- Multi-select capabilities
- Debounced search for performance

### 👥 Role-Based Access
- **Guest Users**: DMA column values are blurred out
- **Client Users**: Full access to all data

## Project Structure

```
placer-interview/
├── Back/                      # Backend server
│   ├── config/
│   │   └── database.ts        # Sequelize configuration
│   ├── controllers/
│   │   ├── authController.ts  # Login/Register handlers
│   │   ├── poisController.ts  # POI business logic
│   │   └── usersController.ts # User management
│   ├── models/
│   │   ├── index.ts           # Model exports
│   │   ├── POI.ts             # POI model (24 fields)
│   │   └── User.ts            # User model with auth
│   ├── routers/
│   │   ├── authRouter.ts      # Auth routes
│   │   ├── poisRouter.ts      # POI routes
│   │   └── usersRouter.ts     # User routes
│   ├── importCSV.ts           # Data import script
│   ├── server.ts              # Express server
│   └── .env                   # Environment variables
├── Front/                     # Frontend application
│   ├── src/
│   │   ├── components/
│   │   │   ├── AutocompleteSearch.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── POIFilters.tsx
│   │   │   ├── POITable.tsx
│   │   │   └── Pagination.tsx
│   │   ├── pages/
│   │   │   └── POIs.tsx       # Main POI page
│   │   ├── services/
│   │   │   └── api.ts         # API client
│   │   ├── types/
│   │   │   ├── poi.types.ts
│   │   │   └── autocomplete.types.ts
│   │   ├── App.tsx            # Router & Navigation
│   │   └── index.css          # Tailwind styles
│   └── ...
```

## Quick Start

### Prerequisites
- Node.js (v20.19+ or v22.12+)
- MySQL server running
- Database `test_db` created

### Database Setup

1. Create the database and tables:
   ```sql
   CREATE DATABASE test_db;
   USE test_db;

   CREATE TABLE users (
     id INT PRIMARY KEY AUTO_INCREMENT,
     username VARCHAR(255) NOT NULL UNIQUE,
     password VARCHAR(255) NOT NULL,
     role VARCHAR(50) NOT NULL DEFAULT 'user'
   );

   CREATE TABLE pois (
     id INT PRIMARY KEY AUTO_INCREMENT,
     entity_id VARCHAR(255),
     name VARCHAR(255),
     foot_traffic INT,
     sales DECIMAL(15,2),
     chain_name VARCHAR(255),
     state_name VARCHAR(255),
     state_code VARCHAR(10),
     city VARCHAR(255),
     street_address VARCHAR(255),
     dma VARCHAR(255),
     date_closed DATE,
     sub_category VARCHAR(255),
     -- ... additional fields
   );
   ```

2. Import POI data:
   ```bash
   cd Back
   npm run import
   ```

### Backend Setup

1. Navigate to the Back directory:
   ```bash
   cd Back
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file with your database credentials:
   ```env
   DB_HOST=127.0.0.1
   DB_NAME=test_db
   DB_USER=root
   DB_PASSWORD=your_password_here
   DB_DIALECT=mysql
   ```

4. Start the backend server:
   ```bash
   npm start
   ```
   
   Server will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the Front directory:
   ```bash
   cd Front
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   
   Frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication Routes (`/api/auth`)

#### POST `/api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "secure_password",
  "role": "client" // or "guest"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "john_doe",
    "role": "client"
  }
}
```

#### POST `/api/auth/login`
Login with username and password.

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "secure_password"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "john_doe",
    "role": "client"
  }
}
```

### POI Routes (`/api/pois`)

#### GET `/api/pois`
Browse and filter POIs with pagination.

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `chain` - Filter by chain name(s)
- `dma` - Filter by DMA(s)
- `category` - Filter by category
- `city` - Filter by city
- `state` or `state_name` - Filter by state
- `is_open` - Filter by open/closed status (true/false)
- `name` - Filter by name (partial match)
- `street_address` - Filter by street (partial match)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Starbucks",
      "chain_name": "Starbucks",
      "city": "New York",
      "state_name": "New York",
      "dma": "New York, NY",
      "foot_traffic": 5000,
      "is_open": true,
      // ... more fields
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 889,
    "totalPages": 45
  },
  "summary": {
    "total": 889,
    "open": 750,
    "closed": 139
  }
}
```

#### GET `/api/pois/filters`
Get available filter options.

**Response:**
```json
{
  "chains": ["Starbucks", "McDonald's", ...],
  "dmas": ["New York, NY", "Los Angeles, CA", ...],
  "categories": ["Coffee Shops", "Fast Food", ...]
}
```

#### GET `/api/pois/autocomplete`
Search across multiple fields.

**Query Parameters:**
- `query` - Search term

**Response:**
```json
{
  "results": [
    {
      "field": "chain_name",
      "value": "Starbucks",
      "label": "Starbucks",
      "count": 150
    },
    {
      "field": "state_name",
      "value": "California",
      "label": "California",
      "count": 200
    }
  ]
}
```

## Adding New Features

### Adding a New Model

1. Create a new model file in `Back/models/YourModel.ts`
2. Define the model structure using Sequelize:
   ```typescript
   import { DataTypes, Model } from 'sequelize';
   import sequelize from '../config/database';

   interface YourModelAttributes {
     id: number;
     name: string;
   }

   class YourModel extends Model<YourModelAttributes> implements YourModelAttributes {
     public id!: number;
     public name!: string;
   }

   YourModel.init(
     {
       id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
       name: { type: DataTypes.STRING, allowNull: false },
     },
     { sequelize, tableName: 'your_table', timestamps: false }
   );

   export default YourModel;
   ```
3. Import and add it to `Back/models/index.ts`

### Adding a New Controller

1. Create `Back/controllers/yourController.ts`:
   ```typescript
   import { Request, Response } from 'express';
   import db from '../models';

   export async function getItems(req: Request, res: Response) {
     try {
       const items = await db.YourModel.findAll();
       res.json(items);
     } catch (error) {
       res.status(500).json({ error: 'Failed to fetch items' });
     }
   }
   ```

### Adding a New Router

1. Create `Back/routers/yourRouter.ts`:
   ```typescript
   import express from 'express';
   import { getItems } from '../controllers/yourController';

   const router = express.Router();
   router.get('/', getItems);

   export default router;
   ```
2. Mount in `Back/server.ts`:
   ```typescript
   import yourRouter from './routers/yourRouter';
   server.use('/api/your-route', yourRouter);
   ```

### Adding a New Frontend Page

1. Create a new page component in `Front/src/pages/YourPage.tsx`
2. Add the route in `Front/src/App.tsx`:
   ```tsx
   <Route path="/your-path" element={<YourPage />} />
   ```
3. Add navigation link in the Navigation component

## Database Structure

### `users` Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,      -- bcrypt hashed
  role VARCHAR(50) NOT NULL DEFAULT 'user'
);
```

### `pois` Table (24 fields)
Key fields include:
- `id` - Primary key
- `entity_id` - External entity identifier
- `name` - POI name
- `chain_name` - Chain/brand name
- `sub_category` - Category classification
- `city`, `state_name`, `state_code` - Location info
- `street_address` - Full address
- `dma` - Designated Market Area
- `foot_traffic` - Visitor count
- `sales` - Sales data
- `date_closed` - Closure date (NULL if open)
- Additional fields for detailed analytics

## Development Tips

- Backend uses `nodemon` for auto-restart on file changes
- Frontend uses Vite HMR for instant updates
- Sequelize is configured to **skip migrations** - it maps to existing tables
- CORS is configured to allow requests from `http://localhost:5173` and `http://localhost:5174`
- Passwords are hashed with bcrypt (10 salt rounds)
- User sessions managed via localStorage (username, role, userId)

## Key Implementation Details

### Authentication Flow
1. User registers with username, password, and role
2. Backend hashes password with bcrypt
3. On login, password is verified with bcrypt.compare()
4. User info stored in localStorage for session persistence
5. Role-based UI rendering (Guest vs Client)

### Filtering System
- **Exact match**: Chain, DMA, Category (using Sequelize `Op.in`)
- **Partial match**: Name, Street Address (using Sequelize `Op.like`)
- Multiple filters combined with AND logic
- Autocomplete groups multiple selections by field with OR logic within field

### Autocomplete Search
- Searches across 5 fields: name, chain_name, state_name, city, street_address
- Results deduplicated and grouped by field
- Color-coded pills for visual distinction
- Street search extracts street name (removes building numbers)
- Debounced by 300ms for performance

### Role-Based Access Control
- **Guest Role**: DMA column values are blurred with CSS (`blur-sm` class)
- **Client Role**: Full access to all data
- Check performed in `POITable` component using localStorage

## Interview Ready Features

✅ Full TypeScript setup (Frontend & Backend)  
✅ Database connection with ORM (Sequelize)  
✅ RESTful API with MVC architecture  
✅ Authentication with password hashing  
✅ Role-based access control  
✅ Modern React with hooks  
✅ Advanced filtering and pagination  
✅ Autocomplete search across multiple fields  
✅ Routing setup with React Router  
✅ Styled with Tailwind CSS  
✅ Error handling & validation  
✅ Loading states  
✅ Environment variables  
✅ CSV data import  
✅ 889 POI records loaded  

## Common Issues

### Database Connection Error
- Check MySQL is running
- Verify credentials in `.env` file
- Ensure `test_db` database exists
- Test connection: `mysql -u root -p`

### Authentication Issues
- Passwords must match on registration
- Check bcrypt is installed: `npm list bcrypt`
- Clear localStorage if experiencing session issues
- Verify User model has password and role fields

### CORS Error
- Make sure backend is running on port 3000
- Frontend should be on port 5173 or 5174
- Check CORS configuration in `server.ts`
- Verify fetch URLs use `http://localhost:3000`

### Port Already in Use
- Backend: Change `PORT` in `.env` or `server.ts`
- Frontend: Vite will automatically suggest a different port
- Kill existing process: `npx kill-port 3000` or `npx kill-port 5174`

### Import CSV Data Not Working
- Ensure CSV file is in correct location
- Check file path in `importCSV.ts`
- Verify POI table schema matches CSV columns
- Run: `npm run import` from Back directory

### Filters Not Working
- Check browser console for errors
- Verify API response in Network tab
- Ensure filter parameters match backend expectations
- Test filters individually before combining

## Future Enhancements

- [ ] JWT token authentication
- [ ] Password reset functionality
- [ ] Export POI data (CSV, Excel)
- [ ] Advanced analytics dashboard
- [ ] Map visualization of POIs
- [ ] Admin panel for user management
- [ ] Email verification on registration
- [ ] POI favorites/bookmarks
- [ ] Real-time updates with WebSockets
- [ ] Unit and integration tests

## License

MIT - Use freely for interviews and projects!
