import React from 'react'
import {useSelector, useDispatch} from 'react-redux'
import { Link } from 'react-router-dom'
import { Pagination, Button, Select, Form, DatePicker, Switch, Input } from 'antd';

import {fetchFamilySelects, fetchFamilyReport, downloadFamilyReport, clearFamilyReport, searchParentsReport} from 'redux/reducers/specsReportReducer'

function SpecsReport() {
    const dispatch = useDispatch()
    const reportsData = useSelector(state=>state.specsReportReducer)
    const [excel, setExcel] = React.useState()
    const [filter, setFilter] = React.useState(false)
    const access = true

    React.useEffect(() => {
        dispatch(fetchFamilyReport('', reportsData.reportPage))
        //dispatch(clearFilters())
    }, [dispatch])

    const paginationHandler = (page) => {
        dispatch(clearFamilyReport())
        dispatch(fetchFamilyReport('', page))
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

    const searchHandler = (val, e) => {
        dispatch(searchParentsReport(val))
    }

    return (
        <div>
            <h1>Выборочный отчет по картам специалистов</h1>
            <a href='/users/detailedReport/excel_all/1' download target='_blank'><Button>Скачать отчет</Button></a>
            <Input.Search
            onSearch={searchHandler}
      placeholder="Поиск"
      allowClear
      style={{ width: 200, margin: '0 10px' }}
    />
            
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
                                <td>{(Array.isArray(el.job)?el.job.map(item=>item.name).join(', '):el.job.name)||'Не указано'}</td> 
                            </tr>
                        )
                    })}
                    
                </tbody>
            </table>
            {Array.isArray(reportsData.children) && reportsData.total>30 && <Pagination defaultCurrent={reportsData.reportPage} total={reportsData.total} onChange={paginationHandler} showSizeChanger={false}  defaultPageSize='30'/>}
        </div>
    )
}

export default SpecsReport
