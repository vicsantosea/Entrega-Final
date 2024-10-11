import Spinner from 'react-bootstrap/Spinner';
import './Loader.css'


const Loader = () => {

  return (
    <div className='loader'>
        <Spinner animation='border' variant='danger'/>
    </div>
  )
}

export default Loader