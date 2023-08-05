import { useState } from 'react';
import './styles.css';

const Modal = ({
  title = "Lorem Ipsum",
  onSubmit,
  onCancel,
  visible
}) => {
  const [inputValue, setInputValue] = useState("");
  
  const handleSubmit = () => {
    if(!inputValue || inputValue == "") {
      return
    }

    onSubmit(inputValue)
  }

  if(!visible) {
    return <></>
  }

  return (
    <div className="modal">
      <div className='modal__container'>
        <h3 className='modal__container--title mt-4'><b>{title}</b></h3>
        <p className='modal__container--description'>Estas a punto de crear un topic, este mismo sera escaneado en la seccion de noticias de google</p>
        <input className="modal__container--input mt-4" type="text" placeholder='Argentina, Cryptocurrencies, Videogames, Politics...' onChange={(e) => setInputValue(e.target.value)}/>
        <div className='modal__container--ctas'>
          <button onClick={onCancel} className='bg-red-500 rounded-md py-1 px-4 hover:bg-red-600 text-white'>Cancel</button>
          <button onClick={handleSubmit} className='bg-blue-500 rounded-md py-1 px-4 hover:bg-blue-600 text-white'>Create</button>
        </div>
      </div>
    </div>
  )
}

export default Modal;