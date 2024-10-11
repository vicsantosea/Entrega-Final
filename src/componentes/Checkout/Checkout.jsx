//Version simple:

/* import { useState, useContext } from "react"
import {CarritoContext} from "../../context/CarritoContext" 
import { db } from "../../services/config"
import { collection, addDoc } from "firebase/firestore"

const Checkout = () => {
    const [nombre, setNombre] = useState("")
    const [apellido, setApellido] = useState("")
    const [telefono, setTelefono] = useState("")
    const [email, setEmail] = useState("")
    const [emailConfirmacion, setEmailConfirmacion] = useState("")
    const [error, setError] = useState("")
    const [ordenId, setOrdenId] = useState("")

    const {carrito, vaciarCarrito, total} = useContext(CarritoContext)

    //funcion y validacion:

    const manejadorFormulario =(e) => {
        e.preventDefault()

        //verificamos que los campos esten completos:
        if(!nombre || !apellido || !telefono || !email || !emailConfirmacion) {
            setError("Por favor completa todos los campos o moriras maldito!")
            return;
        }
        
    

        //validacion que los campos de email coincidan:
        if(email !== emailConfirmacion){
            setError("Los campos del email no coinciden, maildito insecto")
            return;
        }

        //1) creamos un objeto con todos los datos de la orden de compra:

        const orden = {
            items: carrito.map (producto => ({
                id: producto.item.id,
                nombre: producto.item.nombre,
                cantidad: producto.cantidad
            })),
            total: total,
            fecha: new Date(),
            nombre,
            apellido,
            telefono,
            email
        };

        //2) Guardar la orden en la base de datos
        addDoc(collection(db, "ordenes"), orden)
            .then(docRef => {
                setOrdenId(docRef.id)
                vaciarCarrito();
                setNombre("")
                setApellido("")
                setTelefono("")
                setEmail("")
                setEmailConfirmacion("")
            })
            .catch(error => {
                console.log("Error al crear la orden", error)
                setError("Se producjo un error al crear la orden!")
            })
    }

  return (
    <div>
        <h2> Checkout:</h2>

        <form onSubmit={manejadorFormulario}>
            {   
                carrito.map(producto => (
                    <div key={producto.item.id}>
                        <p>{producto.item.nombre}</p>
                        <p>{producto.item.precio} x {producto.cantidad}</p>
                        <p>{producto.item.precio}</p>
                        <hr />
                    </div>
                ))
            }
            <div>
                 <label htmlFor=""> Nombre </label>
                 <input type="text" onChange={(e)=>setNombre(e.target.value)} value={nombre} />                
            </div>
            <div>
                <label htmlFor=""> Apellido </label> 
                <input type="text" onChange={(e)=>setApellido(e.target.value)} value={apellido} /> 
            </div>
            <div>
            <label htmlFor=""> Telefono </label> 
            <input type="text" onChange={(e)=>setTelefono(e.target.value)} value={telefono} /> 
            </div>
            <div>
            <label htmlFor=""> Email </label> 
            <input type="email" onChange={(e)=>setEmail(e.target.value)} value={email} />
            </div>
            <div>
            <label htmlFor=""> Email Confirmacion </label> 
            <input type="email" onChange={(e)=>setEmailConfirmacion(e.target.value)} value={emailConfirmacion}/>
            </div>
                {
                    error && <p style={{color:"red"}}> {error}</p>
                }

            <button type="submit"> Confirmar Compra </button>
            {
                ordenId && (
                    <strong>¡Gracias por tu compra! Tu numero de orden es: {ordenId}</strong>
                )
            }
        </form>
        
    </div>

  )
}

export default Checkout */

//VERSION CON DESCUENTO DE STOCK:

import { useState, useContext } from "react"
import {CarritoContext} from "../../context/CarritoContext" 
import { db } from "../../services/config"
import { collection, addDoc, updateDoc, doc, getDoc } from "firebase/firestore"

const Checkout = () => {
    const [nombre, setNombre] = useState("")
    const [apellido, setApellido] = useState("")
    const [telefono, setTelefono] = useState("")
    const [email, setEmail] = useState("")
    const [emailConfirmacion, setEmailConfirmacion] = useState("")
    const [error, setError] = useState("")
    const [ordenId, setOrdenId] = useState("")

    const {carrito, vaciarCarrito, total} = useContext(CarritoContext)

    //funcion y validacion:

    const manejadorFormulario =(e) => {
        e.preventDefault()

        //verificamos que los campos esten completos:
        if(!nombre || !apellido || !telefono || !email || !emailConfirmacion) {
            setError("Por favor completa todos los campos o moriras maldito!")
            return;
        }
        
    

        //validacion que los campos de email coincidan:
        if(email !== emailConfirmacion){
            setError("Los campos del email no coinciden, maildito insecto")
            return;
        }

        //1) creamos un objeto con todos los datos de la orden de compra:

        const orden = {
            items: carrito.map (producto => ({
                id: producto.item.id,
                nombre: producto.item.nombre,
                cantidad: producto.cantidad
            })),
            total: total,
            fecha: new Date(),
            nombre,
            apellido,
            telefono,
            email
        };
        ///////////////////////////////////////////////////////

        //Vamos a modificar el codigo para que ejecute varias promesas en paralelo, por un lado que actualice el stock de productos y por el otro lado que genere una orden de compra.
        //Vamos a usar para lograr esto: Promise.All

        Promise.all(
            orden.items.map(async (productoOrden) =>{
                const productoRef = doc(db, "productos", productoOrden.id)
                //Por cada prodcuto en la coleccion "productos" obtengo una referencia, y a partir de esa referencia obtengo el DOC.
                const productoDoc = await getDoc(productoRef)
                const stockActual = productoDoc.data().stock
                //data es una metodo que me permite acceder a la informacion del documento

                await updateDoc(productoRef, {
                    stock: stockActual - productoOrden.cantidad
                })
                //modifico el stock y subo la informacion actualizada.
            })
        )
        .then(()=>{

        //Guardar la orden en la base de datos
        addDoc(collection(db, "ordenes"), orden)
            .then(docRef => {
                setOrdenId(docRef.id)
                vaciarCarrito();
                setNombre("")
                setApellido("")
                setTelefono("")
                setEmail("")
                setEmailConfirmacion("")
            })
            .catch(error => {
                console.log("Error al crear la orden", error)
                setError("Se producjo un error al crear la orden!")
            })
        })
        .catch((error) => {
            console.log("No se pudo actualizar el stock", error)
            setError("No se puede actualziar el stock, intente en el supermercado Vital")
        })
    }

  return (
    <div>
        <h2> Checkout:</h2>

        <form onSubmit={manejadorFormulario}>
            {   
                carrito.map(producto => (
                    <div key={producto.item.id}>
                        <p>{producto.item.nombre}</p>
                        <p>{producto.item.precio} x {producto.cantidad}</p>
                        <p>{producto.item.precio}</p>
                        <hr />
                    </div>
                ))
            }
            <div>
                 <label htmlFor=""> Nombre </label>
                 <input type="text" onChange={(e)=>setNombre(e.target.value)} value={nombre} />                
            </div>
            <div>
                <label htmlFor=""> Apellido </label> 
                <input type="text" onChange={(e)=>setApellido(e.target.value)} value={apellido} /> 
            </div>
            <div>
            <label htmlFor=""> Telefono </label> 
            <input type="text" onChange={(e)=>setTelefono(e.target.value)} value={telefono} /> 
            </div>
            <div>
            <label htmlFor=""> Email </label> 
            <input type="email" onChange={(e)=>setEmail(e.target.value)} value={email} />
            </div>
            <div>
            <label htmlFor=""> Email Confirmacion </label> 
            <input type="email" onChange={(e)=>setEmailConfirmacion(e.target.value)} value={emailConfirmacion}/>
            </div>
                {
                    error && <p style={{color:"red"}}> {error}</p>
                }

            <button type="submit"> Confirmar Compra </button>
            {
                ordenId && (
                    <strong>¡Gracias por tu compra! Tu numero de orden es: {ordenId}</strong>
                )
            }
        </form>
        
    </div>

  )
}

export default Checkout

