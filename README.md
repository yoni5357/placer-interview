# Full Stack Interview Template

A minimal full-stack application template with React, TypeScript, Express, and MySQL.

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **React Router** for navigation
- **Tailwind CSS** for styling

### Backend
- **Express** with TypeScript
- **Sequelize ORM** with MySQL
- **CORS** enabled for frontend communication
- **dotenv** for environment variables

### Database
- **MySQL** with Sequelize (no migrations)

## Project Structure

```
placer-interview/
├── Back/                # Backend server
│   ├── config/          # Database configuration
│   ├── models/          # Sequelize models
│   ├── .env             # Environment variables
│   └── server.ts        # Express server
├── Front/               # Frontend application
│   ├── src/
│   │   ├── pages/       # Page components
│   │   ├── App.tsx      # Main app with router
│   │   └── index.css    # Tailwind styles
│   └── ...
```

## Quick Start

### Prerequisites
- Node.js (v20.19+ or v22.12+)
- MySQL server running
- Database `test_db` created with a `users` table

### Backend Setup

1. Navigate to the Back directory:
   ```bash
   cd Back
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Create/update `.env` file with your database credentials:
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

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   
   Frontend will run on `http://localhost:5173`

## API Endpoints

### GET `/api/users`
Fetches all users from the database.

**Response:**
```json
[
  {
    "id": 1,
    "username": "john_doe"
  }
]
```

## Adding New Features

### Adding a New Model

1. Create a new model file in `Back/models/YourModel.ts`
2. Define the model structure using Sequelize
3. Import and add it to `Back/models/index.ts`

### Adding a New Route

Add routes in `Back/server.ts`:

```typescript
server.get('/api/your-route', async (req: Request, res: Response) => {
  // Your logic here
});
```

### Adding a New Page

1. Create a new page component in `Front/src/pages/YourPage.tsx`
2. Add the route in `Front/src/App.tsx`:

```tsx
<Route path="/your-path" element={<YourPage />} />
```

3. Add navigation link in the nav bar

## Database Structure

Current `users` table:
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL
);
```

## Development Tips

- Backend uses `nodemon` for auto-restart on file changes
- Frontend uses Vite HMR for instant updates
- Sequelize is configured to **skip migrations** - it maps to existing tables
- CORS is configured to allow requests from `http://localhost:5173`

## Interview Ready Features

✅ Full TypeScript setup (Frontend & Backend)  
✅ Database connection with ORM  
✅ RESTful API structure  
✅ Modern React with hooks  
✅ Routing setup  
✅ Styled with Tailwind CSS  
✅ Error handling  
✅ Loading states  
✅ Environment variables  

## Common Issues

### Database Connection Error
- Check MySQL is running
- Verify credentials in `.env` file
- Ensure `test_db` database exists

### CORS Error
- Make sure backend is running on port 3000
- Frontend should be on port 5173
- Check CORS configuration in `server.ts`

### Port Already in Use
- Backend: Change `PORT` in `.env` or `server.ts`
- Frontend: Vite will automatically suggest a different port

## License

MIT - Use freely for interviews and projects!
