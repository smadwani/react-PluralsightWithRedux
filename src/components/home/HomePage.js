import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => (
  <div className="jumbotron">
    <h1>Sushil Web Site</h1>
    <p>Recalling React with Redux capabilities</p>
    <Link to="about" className="btn btn-primary btn-lg">
      About Sushil
    </Link>
  </div>
);

export default HomePage;
