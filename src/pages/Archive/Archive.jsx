import React from 'react'
import {useSelector, useDispatch} from 'react-redux'
import { Link } from 'react-router-dom'
import {fetchArchives} from 'redux/reducers/archiveReducer'
import { Button, Pagination } from 'antd';
import axios from 'axios';
import 'pages/Reports/reports.scss'


function Archive() {
    const dispatch = useDispatch()
    const {archives, archivesPage} = useSelector(state=>state.archiveReducer)

    React.useEffect(() => {
        dispatch(fetchArchives(archivesPage))
    }, [dispatch])

    const paginationHandler = (page) => {
        dispatch(fetchArchives(page))
    }

    const approveHandler = (id) => {
        axios.get(`/archiving/approveRequest/${id}`, {headers: {accept: 'text/json'}})
        .then((response) => {
            if (response.status == 200) {
                dispatch(fetchArchives(archivesPage))
            } else {
                alert("Что-то пошло не так")
            }
        })
    }

    const declineHandler = (id, module, el_id) => {
        axios.get(`/archiving/returnFromArchive/${module}/${id}/${el_id}`, {headers: {accept: 'text/json'}})
        .then((response) => {
            if (response.data.success === true) {
                dispatch(fetchArchives(archivesPage))
            } else {
                alert("Что-то пошло не так")
            }
        })
    }

    return (
        <div>
            <h2 style={{marginBottom: '20px'}}>Запросы на архивацию карт</h2>
            <table  className='report__table'>
                <thead>
                    <tr>
                        <th>Логин</th>
                        <th>ФИО</th>
                        <th>Обоснование</th>
                        <th>Ссылка на карту</th>
                        <th>Одобрить запрос</th>
                        <th>Отклонить запрос</th>
                    </tr>
                </thead>
                <tbody>
                    {archives && Array.isArray(archives.data) && archives.data.map(el => {
                        return (
                            <tr>
                                <td>{el.user && el.user.name}</td>
                                <td>{el.user && el.user.fio}</td>
                                <td>{el.descr}</td>
                                <td><Link to={`/${el.moduleName}/view/${el.object_id}`}>{el.name}</Link></td> 
                                <td><Button onClick={()=>approveHandler(el.id)}>Одобрить</Button></td>
                                <td><Button onClick={()=>declineHandler(el.object_id, el.moduleName, el.id)}>Отклонить</Button></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            {archives && archives.total>10 && <Pagination defaultCurrent={archivesPage} total={archives.total} onChange={paginationHandler}/>}
        </div>
    )
}

export default Archive
