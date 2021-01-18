import { MenuOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import React from 'react'
import { useSelector } from 'react-redux'

import './SideBar.scss'
import SideBarItem from './SideBarItem'
import {sideData} from './sideData'


const mappedLinks = sideData.map(el => <SideBarItem text={el.text} link={el.link} key={el.text} icon={el.icon} access={el.access}/>)
const mappedLinksAdmin = sideData.map(el => <SideBarItem text={el.text} link={el.link} key={el.text} icon={el.icon} access={true}/>)

function SideBar() {
    const userData = useSelector(state => state.userReducer)
    const [access, setAccess] = React.useState(false)
    const [hamburger, setHamburger] = React.useState(false)
    
    React.useEffect(() => {
        if (userData.lvl==='admin' || userData.lvl === 'region'|| userData.lvl === 'master'|| userData.lvl === 'curator') {
          setAccess(true)
        }
    }, [userData.lvl])

    const menuHandler = () => {
        hamburger ? setHamburger(false) : setHamburger(true)
    }

    return (<>
        <Button className='sidebar__hamburger' type='primary' onClick={menuHandler}><MenuOutlined /></Button>
        <div className={`app__sidebar sidebar ${hamburger && 'sidebar--active'}`}>
            <ul>
            {access ? mappedLinksAdmin : mappedLinks}
            </ul>
        </div>
    </>)
}

export default SideBar
