import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import POIs from './pages/POIs';
import Login from './components/Login';
import Register from './components/Register';

function Navigation() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            {username && (
              <Link 
                to="/pois" 
                className="inline-flex items-center px-1 pt-1 text-gray-900 font-semibold border-b-2 border-transparent hover:border-blue-500"
              >
                POIs
              </Link>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {username ? (
              <>
                <span className="text-gray-700">
                  <span className="font-medium">{username}</span>
                  {role && <span className="text-gray-500 text-sm ml-2">({role})</span>}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="space-x-2">
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Navigation */}
        <Navigation />

        {/* Routes */}
        <main className="max-w-7xl mx-auto py-6 px-4">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/pois" element={<POIs />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
