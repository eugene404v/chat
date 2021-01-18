import { Pagination } from 'antd'
import React from 'react'
import {useSelector, useDispatch} from 'react-redux'
import { Link } from 'react-router-dom'
import {fetchArchives} from 'redux/reducers/autocheckReducer'
import moment from 'moment'
import 'pages/Reports/reports.scss'
function AutoCheck() {
    const dispatch = useDispatch()
    const checkData = useSelector(state => state.autocheckReducer)

    React.useEffect(() => {
        dispatch(fetchArchives(checkData.archivesPage))
    }, [dispatch, checkData.archivesPage])

    const paginationHandler = (page) => {
        dispatch(fetchArchives(page))
    }

    return (
        <div>
            <h1>Автосверка</h1>
            <table  className='report__table'>
                <thead>
                    <tr>
                        <th>Карта</th>
                        <th>Последняя проверка</th>
                        <th>Ошибки</th>
                    </tr>
                </thead>
                <tbody>
                    {checkData && Array.isArray(checkData.archives) && checkData.archives.map(el => {
                        return (
                            <tr> 
                                <td><Link to={`/${el.moduleName}/view/${el.objectId}`}>{el.name}</Link></td>
                                <td>{moment(el.last_checking).format('DD-MM-YYYY').toString()}</td> 
                                <td>{Array.isArray(el.errors) && el.errors.map(el => {
                                    return el.info
                                }).join(', ')}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            {checkData.archives && checkData.total>10 && <Pagination defaultCurrent={checkData.archivesPage} total={checkData.total} onChange={paginationHandler} showSizeChanger={false}/>}
        </div>
    )
}

export default AutoCheck
