import React, {useState} from 'react'
import Button from 'react-bulma-components/lib/components/button'
import Modal from 'react-bulma-components/lib/components/modal'

export default function OpenModal(props) {
    const [show, setShow] = useState(false)
    const open = () => setShow(true)
    const close = () => setShow(false)


    return (
        <div>
          <Button onClick={open}>Open</Button>
          <Modal show={show} onClose={close} {...props.modal}>
            {props.children}
          </Modal>
        </div>
      
    )
  }