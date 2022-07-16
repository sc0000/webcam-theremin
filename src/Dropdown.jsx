import React, { useState } from 'react'

import './'

const Dropdown = (props) => {
    const [open, setOpen] = useState(false);

  return (
    <div className="dropdown">
        <div className={open ? "btn btn-hand" : "btn btn-pitch"} onClick={() => setOpen(!open)}>
            octave 3-3
        </div>

        {open && props.children}
    </div>
    
  )
}

export default Dropdown