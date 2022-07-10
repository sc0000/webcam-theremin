import React, { useState } from 'react'

import './'

const Dropdown = (props) => {
    const [open, setOpen] = useState(false);

  return (
    <div className="dropdown">
        <div className={open ? "btn btn-hand btn-hand-active" : "btn btn-hand"} onClick={() => setOpen(!open)}>
            Pitch
        </div>

        {open && props.children}
    </div>
    
  )
}

export default Dropdown