import React from 'react'
import AddAlert from "@material-ui/icons/AddAlert";
import Snackbars from "components/Snackbar/Snackbar.js";

function NotifAlert  ({open, color, message, onClose }) {
 

    return  <Snackbars
    place="br"
    color={color}
    icon={AddAlert}
    message={message}
    open={open}
    closeNotification={onClose}
    close
  />
}

export default NotifAlert