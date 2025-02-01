// import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">Waste Classification & Health API</div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/classify">Waste Classification</Link></li>
        <li><Link to="/health">Health</Link></li>
        <li><Link to="/food-recommendation">Food Recommendation</Link></li>
        <li><Link to="/food-alternatives">Food Alternatives</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
