import React from 'react'
import {Button as AntdButton} from 'antd'
import './Button.scss'
import classNames from 'classnames'

function Button(props) {
    return (
        <AntdButton {...props} className={classNames('button antd-btn', props.className)} >
            
        </AntdButton>
    )
}

export default Button
