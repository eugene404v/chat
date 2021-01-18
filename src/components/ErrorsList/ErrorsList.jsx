import { ExclamationCircleOutlined } from '@ant-design/icons'
import React from 'react'
import './errors.scss'

function ErrorsList({list}) {
    return (
        <div className='errors'>
            <h2  className='errors__title'><ExclamationCircleOutlined className='errors__icon'/>Ошибки</h2>
            <ul className='errors__list'>
                {Array.isArray(list) && list.map(el => {
                    return (
                        <li className="errors__li" style={{color: 'red'}}>
                            {el.info}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default ErrorsList
