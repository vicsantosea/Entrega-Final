import React from 'react'
import './CartWidget.css'
import { useContext } from 'react'
import { CarritoContext } from '../../context/CarritoContext'
import { Link } from 'react-router-dom'

const CartWidget = () => {
  const {cantidadTotal} = useContext(CarritoContext)

  return (
    <div>
      <Link to="/cart">
        <img className='carrito' src="./img/carrito.jpg" alt="Carrito de compras" />
      </Link>
        {
          cantidadTotal > 0 && <span>{cantidadTotal}</span>
        }

        
    </div>
  )
}

export default CartWidget