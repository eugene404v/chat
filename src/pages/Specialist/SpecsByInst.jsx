import React from 'react'
import {useSelector, useDispatch} from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { Pagination, Button, Select, Form, DatePicker, Switch } from 'antd';

import {fetchFamilySelects, fetchFamilyReport, downloadFamilyReport} from 'redux/reducers/specsReportReducer'

function SpecsReport() {
    const dispatch = useDispatch()
    const reportsData = useSelector(state=>state.specsReportReducer)
    const [excel, setExcel] = React.useState()
    const [filter, setFilter] = React.useState(false)
    const access = true
    const urlId = useParams().id

    React.useEffect(() => {
        dispatch(fetchFamilyReport({institution: urlId}, 1))
        //dispatch(clearFilters())
    }, [dispatch])

    const paginationHandler = (page) => {
        //dispatch(clearCommonReport())
        //dispatch(fetchCommonReport(reportsData.prof, reportsData.inst, page))
    }


    const showReportHandler = (vals) => {
       dispatch(fetchFamilyReport(vals))
       alert(JSON.stringify(vals))
        setExcel(true)
    }


    const showFiltersHandler = () => {
        filter ? setFilter(false) : setFilter(true)
    }

    const excelHandler = () => {
        dispatch(downloadFamilyReport(reportsData.filters))
    }

    return (
        <div>
            <h1>Выборочный отчет по картам специалистов</h1>
            <table className='report__table'>
                <thead>
                    <tr>
                        <th>ФИО</th>
                        <th>Район</th>
                        <th>Учреждение</th>
                        <th>Должность</th>
                    </tr>
                </thead>
                <tbody>
                    {reportsData && Array.isArray(reportsData.children) && reportsData.children.map(el => {
                        return (
                            <tr>
                                <td><Link to={`/users/view/${el.id}`}>{el.fio||'Не указано'}</Link></td> 
                                <td>{(el.district && el.district.name)||'Не указано'}</td>
                                <td>{(el.institution && el.institution.name)||'Не указано'}</td>
                                <td>{(el.job && el.job.name)||'Не указано'}</td>
                            </tr>
                        )
                    })}
                    {Array.isArray(reportsData.children) && reportsData.children.length>10 && <Pagination defaultCurrent={1} total={reportsData.children.length} onChange={paginationHandler}/>}
                </tbody>
            </table>
        </div>
    )
}

export default SpecsReport
