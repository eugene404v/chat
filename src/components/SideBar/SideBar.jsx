import React from 'react'

import './SideBar.scss'
import SideBarItem from './SideBarItem'
import {sideData} from './sideData'

const mappedLinks = sideData.map(el => <SideBarItem text={el.text} link={el.link} key={el.text} icon={el.icon}/>)

function SideBar() {
    return (
        <div className='app__sidebar sidebar'>
            <ul>
                {mappedLinks}
            </ul>
        </div>
    )
}

export default SideBar
