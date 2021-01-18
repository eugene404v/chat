import React from 'react'
import {useSelector, useDispatch} from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { Pagination, Button, Select, Form, DatePicker, Switch } from 'antd';

import {fetchChildrenSelects, fetchChildrenReport, downloadReport} from 'redux/reducers/childrenReportReducer'

function ChildrenReport() {
    const dispatch = useDispatch()
    const reportsData = useSelector(state=>state.childrenReportReducer)
    const [excel, setExcel] = React.useState()
    const [filter, setFilter] = React.useState(false)
    const access = true
    const urlId = useParams().id

    React.useEffect(() => {
        dispatch(fetchChildrenReport({institution: urlId}, 1, true))
        //dispatch(clearFilters())
    }, [dispatch])

    const paginationHandler = (page) => {
        //dispatch(clearCommonReport())
        //dispatch(fetchCommonReport(reportsData.prof, reportsData.inst, page))
    }


    const showReportHandler = (vals) => {
       dispatch(fetchChildrenReport(vals))
       alert(JSON.stringify(vals))
        setExcel(true)
    }

    const showFiltersHandler = () => {
        filter ? setFilter(false) : setFilter(true)
    }

    const excelHandler = () => {
        dispatch(downloadReport(reportsData.filters))
    }

    return (
        <div>
            <h1>Список детей</h1>
            <table className='report__table'>
                <thead>
                    <tr>
                        <th>ФИО ребенка</th>
                        <th>Дата рождения</th>
                    </tr>
                </thead>
                <tbody>
                    {reportsData && Array.isArray(reportsData.children) && reportsData.children.map(el => {
                        return (
                            <tr className={`report__row${el.archived ? ' report__row--archive1111d' : ''}${el.errors ? ' report__row--error11111' : ''}`}>
                            <td><Link to={`/children/view/${el.id}`}>{el.name}</Link></td> 
                            <td>{el.birthDate}</td>
                        </tr>
                        )
                    })}
                    {Array.isArray(reportsData.children) && reportsData.children.length>10 && <Pagination defaultCurrent={1} total={reportsData.children.length} onChange={paginationHandler}/>}
                </tbody>
            </table>
        </div>
    )
}

export default ChildrenReport
