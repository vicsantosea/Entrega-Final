import React from 'react'
import './NavBar.css'
import CartWidget from '../CartWidget/CartWidget'
import { Link, NavLink } from 'react-router-dom'

const NavBar = () => {
  return (
    <header>
      <Link to="/">
        <img  className='logoMarolio' src={"./img/Preview.png"} alt="Logo" />
      </Link>

        <nav>
            <ul>
                <li>
                  <NavLink to="/"> PlayStation </NavLink>
                
                </li>

                <li>
                  <NavLink to="/categoria/Xbox"> Xbox </NavLink>
                  
                </li>

                <li>
                 <NavLink to="/categoria/Nintendo"> Nintendo </NavLink> 
                </li>
            </ul>
        </nav>

        <CartWidget/>

    </header>
  )
}

export default NavBar