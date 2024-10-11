import React, { useEffect, useState } from 'react'
import ItemDetail from '../ItemDetail/ItemDetail'
import { useParams } from 'react-router-dom'
import { db } from '../../services/config'
import {getDoc, doc} from 'firebase/firestore'

const ItemDetailContainer = () => {

    const [producto, setProducto] = useState(null)

    const {idItem} = useParams()

  useEffect(()=>{
    const nuevoDoc = doc(db, "productos", idItem)

    getDoc(nuevoDoc)
      .then(res => {
        const data = res.data();
        const nuevosProducto = {id: res.id,...data}
        setProducto(nuevosProducto)
      })
      .catch(error => console.log(error))
  }, [idItem])

    



  return (
    <div>
        <ItemDetail {...producto}/>
    </div>
  )
}


export default ItemDetailContainer