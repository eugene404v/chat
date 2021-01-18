import React from 'react'
import { Link } from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {fetchLkUsers} from 'redux/reducers/userReducer'
import { Pagination, Button } from 'antd';
import { AdminPrompt } from 'components';

function LkUsersList(props) {
    const dispatch = useDispatch()
    const {users, usersPage} = useSelector(state=>state.userReducer)
    const [id, setId] = React.useState()
    const [prompt, setPrompt] = React.useState(false)
    const [del, setDel] = React.useState(false)
    const [pass, setPass] = React.useState(false)

    React.useEffect(() => {
        dispatch(fetchLkUsers(usersPage))
    }, [dispatch])

    const paginationHandler = (page) => {
        dispatch(fetchLkUsers(page))
    }

    

    

    const deleteHandler = () => {
        console.log(id)
    }

    const UsersRow = (props) => {
        const [del, setDel] = React.useState(false)
        const [pass, setPass] = React.useState(false)

        const passwordHandler = () => {
        setPass(true)
        setDel(false)
        }

        const deleteHandler = () => {
        setPass(false)
        setDel(true)
        }

        const cancelHandler = () => {
            setPass(false)
            setDel(false)
        }


        return (<>
            <tr key={Math.random()}>
                <td>{props.name}</td>
                <td><Link to={`/users/view/${props.id}`}>{props.fio || 'Не указано'}</Link></td>
                <td>{props.type}</td>
                <td><Button onClick={passwordHandler}>Сбросить пароль</Button></td>
                <td><Button onClick={deleteHandler}>Удалить пользователя</Button></td>
            </tr>
            {(pass || del) && <tr>
                {pass && <td colSpan='6'><AdminPrompt id={props.id} view={true} password={true} delete={false} onCancel={cancelHandler} /></td>}
                {del && <td colSpan='6'><AdminPrompt id={props.id} view={true} password={false} delete={true} onCancel={cancelHandler} /></td>}
            </tr>}
        </>)
    }

    return (
        <div className='lk__item'>
            <h2>Список пользователей</h2>
            {<Link to='/create/specialists'>Создать пользователя</Link>}
            
            <table className='LKactive'>
                <thead>
                    <tr>
                        <th>Логин</th>
                        <th>ФИО</th>
                        <th>Уровень</th>
                        <th>Получить пароль</th>
                        <th>Удалить пользователя</th>
                    </tr>
                </thead>
                <tbody>
                    {users && Array.isArray(users.data) && users.data.map(el => {
                        return (<UsersRow id={el.id} name={el.name} fio={el.fio} type={el.type}  />
                        )
                    })}
                </tbody>
            </table>
            {users && users.total>30 && <Pagination defaultCurrent={usersPage} total={users.total} onChange={paginationHandler} showSizeChanger={false} defaultPageSize='30'/>}
            
        </div>
    )
}

export default LkUsersList
