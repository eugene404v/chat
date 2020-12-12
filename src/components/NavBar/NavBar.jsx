import React from 'react'
import axios from 'axios'
import {useHistory } from 'react-router-dom'

function NavBar() {
    const history = useHistory()
    const logoutHandler = () => {
axios.post('/users/logout', {}, {
    headers: {
        accept: 'text/json'
    }
}).then((response)=> {
    history.push('/login')
})
    }

    return (
        <div className='app__navbar'>
            <h1>NAVBAR </h1>
            <button onClick={logoutHandler}>logout</button>
        </div>
    )
}

export default NavBar
