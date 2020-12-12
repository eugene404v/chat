import React from 'react'
import {Link} from 'react-router-dom'

function SideBarItem(props) {
    return (
        <li className="sidebar__li" style={{color: '#5DADF6'}}>
            {props.icon}
            <Link to={props.link} style={{color: '#5DADF6'}}>{props.text}</Link>
        </li>
    )
}

export default SideBarItem
