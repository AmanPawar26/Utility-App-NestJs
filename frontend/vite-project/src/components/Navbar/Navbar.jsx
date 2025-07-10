import React from 'react'
import './Navbar.css'
import logo from '../../assets/logo.png'

const Navbar = () => {
    return (
        <nav>
            <div className="logo-container">
                <a href="#">
                    <img src={logo} alt="logo" />
                </a>
                <div className="logo-text">UtilityApp</div>
            </div>

            <div className="nav-container">
                <ul>
                    <ul>
                        <li><a href="#home">HOME</a></li>
                        <li><a href="#features">FEATURES</a></li>
                        <li><a href="#about">ABOUT US</a></li>
                    </ul>

                </ul>
            </div>

            
        </nav>
    )
}

export default Navbar;