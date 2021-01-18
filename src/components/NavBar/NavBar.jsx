import React from 'react'
import axios from 'axios'
import {useHistory } from 'react-router-dom'
import {Button} from 'antd'
import { PoweroffOutlined } from '@ant-design/icons';
import './NavBar.scss'
import { useDispatch } from 'react-redux';
import {clearMe} from 'redux/reducers/userReducer'

function NavBar() {
    const dispatch = useDispatch()
    const history = useHistory()
    const logoutHandler = () => {
axios.post('/users/logout', {}, {
    headers: {
        accept: 'text/json'
    }
}).then((response)=> {
    history.push('/login')
    dispatch(clearMe())
})
    }

    return (
        <div className='app__navbar navbar'>
            <Button className='navbar__logout' type="primary" onClick={logoutHandler} icon={<PoweroffOutlined />}>Выйти</Button>
        </div>
    )
}

export default NavBar
