import React from 'react';
import PropTypes from 'prop-types';
import banpLogo from '../../images/banp-logo.jpg';
import './Navbar.css';

const Navbar = ({ title }) => {
  return (
    <nav className="navbar bg-primary">
      <div>
        <img src={banpLogo} alt="" />
      </div>
      <h1>{title}</h1>
      <ul>
        <li>
          <a href="">Home</a>
        </li>
        <li>
          <a href="">About</a>
        </li>
      </ul>
    </nav>
  );
};

Navbar.defaultProps = {
  title: 'Banana Plant Tracker'
};

Navbar.propTypes = {
  title: PropTypes.string.isRequired
};

export default Navbar;
