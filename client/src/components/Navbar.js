import React from 'react'
import {Link, useLocation} from "react-router-dom";


const Navbar = () => {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
  <Link className="navbar-brand" to="/home">notebook</Link>
  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>

  <div className="collapse navbar-collapse" id="navbarSupportedContent">
    <ul className="navbar-nav mr-auto">
      <li className="nav-item active">
        <Link className={`nav-link ${location.pathname==="/register"?"active":""}`} to="/register">Register <span className="sr-only">(current)</span></Link>
      </li>
    </ul>
    <ul className="navbar-nav mr-auto">
      <li className="nav-item active">
        <Link className={`nav-link ${location.pathname==="/login"?"active":""}`} to="/login">Login <span className="sr-only">(current)</span></Link>
      </li>
    </ul>
   
  </div>
</nav>
    </div>
  )
}

export default Navbar
