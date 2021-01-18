import { Input, Form, Button } from 'antd'
import React from 'react'
import './AdminPrompt.scss'
import axios from 'axios'

function AdminPrompt(props) {
    const [view, setView] = React.useState(props.view)
    const [adminPassword, setAdminPassword] = React.useState('')
    const deleteHandler = () => {
        let formdata = new FormData()
        formdata.append('password', adminPassword)
        axios
        .post(`/users/delUser/${props.id}`, formdata, {headers: {accept: 'text/json'}})
        .then((response)=> {
            if (response.data.success === true) {
                props.onCancel()
            } else {
                alert(response.data.info)
            }
        })
        props.onCancel()
    }
    const passwordHandler = () => {
        let formdata = new FormData()
        formdata.append('password', adminPassword)
        axios
        .post(`/users/resetPassword/${props.id}`, formdata, {headers: {accept: 'text/json'}}) 
        .then((response)=> { 
            if (response.data.success === true) {
                props.onCancel()
            } else {
                alert(response.data.info)
            }
        })
        props.onCancel()
    }

    const inputHandler = (e) => {
        setAdminPassword(e.target.value)
    }
    
    return (<>
        {props.view && <div className='prompt'>
            <div className="prompt__content">
                <Input.Password visibilityToggle={true} placeholder='Введите пароль администратора' onChange={inputHandler}/>
                {props.delete && <Button onClick={deleteHandler}>Удалить</Button>}
                {props.password && <Button onClick={passwordHandler}>Пароль</Button>}
                <Button type='reset' onClick={props.onCancel}>Отмена</Button>
            </div>
        </div>}
        </>
    )
}

export default AdminPrompt
