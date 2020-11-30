import React from 'react'

import './Pair.scss'

function Pair(props) {
    return (
        <div className='pair'>
            <div className="pair__descr">{props.descr}</div>
            <div className="pair__value">{props.children}</div>
        </div>
    )
}

export default Pair
