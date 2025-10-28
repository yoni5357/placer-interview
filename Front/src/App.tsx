import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Users from './pages/Users';
import POIs from './pages/POIs';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Navigation */}
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex space-x-8">
                <Link 
                  to="/pois" 
                  className="inline-flex items-center px-1 pt-1 text-gray-900 font-semibold border-b-2 border-transparent hover:border-blue-500"
                >
                  POIs
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <main className="max-w-7xl mx-auto py-6 px-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pois" element={<POIs />} />
            <Route path="/users" element={<Users />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
