import React from 'react'
import {Link} from 'react-router-dom'

function SideBarItem(props) {
    return (<>
        {props.access && <li className="sidebar__li">
            {props.icon}
            <Link to={props.link} className='sidebar__link'>{props.text}</Link>
        </li>}
        </>
    )
}

export default SideBarItem
