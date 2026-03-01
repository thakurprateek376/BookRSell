import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-5 py-4">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h5>BookRsell</h5>
            <p>Your trusted platform for buying and selling second-hand books</p>
          </div>
          <div className="col-md-6">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-white-50 text-decoration-none">Home</a></li>
              <li><a href="/about" className="text-white-50 text-decoration-none">About</a></li>
              <li><a href="/contact" className="text-white-50 text-decoration-none">Contact</a></li>
            </ul>
          </div>
        </div>
        <hr />
        <div className="text-center text-white-50">
          <p>&copy; 2024 BookRsell. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
