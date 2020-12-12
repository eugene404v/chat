import React from 'react'
import { Link } from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {fetchLkUsers} from 'redux/reducers/userReducer'
import { Pagination, Button } from 'antd';

function LkUsersList(props) {
    const dispatch = useDispatch()
    const {users, usersPage} = useSelector(state=>state.userReducer)

    React.useEffect(() => {
        dispatch(fetchLkUsers(usersPage))
    }, [dispatch])

    const paginationHandler = (page) => {
        dispatch(fetchLkUsers(page))
    }

    const passwordHandler = (id) => {

    }

    const deleteUserHandler = (id) => {

    }

    return (
        <div>
            <h2>Список пользователей</h2>
            <Link to='/create/specialists'>Создать пользователя</Link>
            <table>
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
                        return (
                            <tr>
                                <td>{el.name}</td>
                                <td><Link to={`/users/view/${el.id}`}>{el.fio}</Link></td>
                                <td>{el.type}</td>
                                <td><Button onClick={() => passwordHandler(el.objectId)}>Получить пароль</Button></td>
                                <td><Button onClick={() => deleteUserHandler(el.objectId)}>Удалить пользователя</Button></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            {users && users.total>10 && <Pagination defaultCurrent={usersPage} total={users.total} onChange={paginationHandler}/>}
            
        </div>
    )
}

export default LkUsersList
