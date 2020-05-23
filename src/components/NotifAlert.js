import React, { useState } from 'react'
import AddAlert from '@material-ui/icons/AddAlert'
import Snackbar from 'components/Snackbar/Snackbar.js'
import { useInterval } from 'app/hooks'

function NotifAlert({ open, color, message, onClose, autoclose }) {
  const [delay, setDelay] = useState(
    open && autoclose ? 5000 : null,
  )

  useInterval(() => {
    setDelay(null)
    onClose()
  }, delay)

  return (
    <Snackbar
      place='br'
      color={color}
      icon={AddAlert}
      message={message}
      open={open}
      closeNotification={onClose}
      close
    />
  )
}

export default NotifAlert
