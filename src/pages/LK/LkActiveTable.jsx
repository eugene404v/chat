import React from 'react'
import {useSelector, useDispatch} from 'react-redux'
import { Link } from 'react-router-dom'
import {fetchActivity} from 'redux/reducers/userReducer'
import { Pagination } from 'antd';

function LkActiveTable(props) {
    const dispatch = useDispatch()
    const {activity, activityPage} = useSelector(state=>state.userReducer)

    React.useEffect(() => {
        dispatch(fetchActivity(activityPage))
    }, [dispatch])

    const paginationHandler = (page) => {
        dispatch(fetchActivity(page))
    }

    return (
        <div>
            <h2>Отслеживание активности</h2>
            <table>
                <thead>
                    <tr>
                        <th>Логин</th>
                        <th>ФИО</th>
                        <th>Район</th>
                        <th>Дата изменений</th>
                        <th>Измененная карта</th>
                    </tr>
                </thead>
                <tbody>
                    {activity && Array.isArray(activity.data) && activity.data.map(el => {
                        return (
                            <tr>
                                <td>{el.user && el.user.name}</td>
                                <td>{el.user && el.user.fio}</td>
                                <td>{el.user && el.user.district && el.user.district.name}</td>
                                <td>{el.create_time}</td>
                                <td><Link to={`/${el.moduleName}/view/${el.objectId}`}>{el.name}</Link></td> 
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            {activity && activity.total>10 && <Pagination defaultCurrent={activityPage} total={activity.total} onChange={paginationHandler}/>}
        </div>
    )
}

export default LkActiveTable
