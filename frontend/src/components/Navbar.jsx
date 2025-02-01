// components/Navbar.jsx
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center py-4">
          <div className="text-xl font-bold text-green-600">
            Waste Classification & Health API
          </div>
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="text-gray-600 hover:text-green-600 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/classify" className="text-gray-600 hover:text-green-600 transition-colors">
                Waste Classification
              </Link>
            </li>
            <li>
              <Link to="/health" className="text-gray-600 hover:text-green-600 transition-colors">
                Health
              </Link>
            </li>
            <li>
              <Link to="/food-recommendation" className="text-gray-600 hover:text-green-600 transition-colors">
                Food Recommendation
              </Link>
            </li>
            <li>
              <Link to="/food-alternatives" className="text-gray-600 hover:text-green-600 transition-colors">
                Food Alternatives
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;