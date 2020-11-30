import React from 'react'
import './WhiteDiv.scss'
import classNames from 'classnames'

function WhiteDiv(props) {
    return (
        <div className={classNames("block", props.className)}>
            {props.children}
        </div>
    )
}

export default WhiteDiv
