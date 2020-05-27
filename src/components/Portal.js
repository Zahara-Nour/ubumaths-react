import React from 'react'
import PortalMui from '@material-ui/core/Portal'

function Portal({container, onRendered, children,...rest}) {
  

    return (
        <PortalMui container={container} onRendered={onRendered}>
            {React.cloneElement(children, rest)}
        </PortalMui>
    )





}

export default Portal