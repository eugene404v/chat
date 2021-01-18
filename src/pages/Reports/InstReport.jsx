import React from 'react'
import {useSelector, useDispatch} from 'react-redux'
import { Link } from 'react-router-dom'
import { Pagination, Button, Select, Form, DatePicker, Switch, Input } from 'antd';

import {fetchFamilySelects, fetchFamilyReport, downloadFamilyReport, clearFamilyReport, searchParentsReport} from 'redux/reducers/instReportReducer'

function InstReport() {
    const dispatch = useDispatch()
    const reportsData = useSelector(state=>state.instReportReducer)
    const [excel, setExcel] = React.useState()
    const [filter, setFilter] = React.useState(false)
    const access = true

    React.useEffect(() => {
        dispatch(fetchFamilyReport('',reportsData.reportPage))
        setExcel(true)
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
        dispatch(downloadFamilyReport())
    }

    const searchHandler = (val, e) => {
        dispatch(searchParentsReport(val))
    }

    return (
        <div>
            <h1>Выборочный отчет по картам учреждений</h1>
            <a href='/institution/detailedReport/excel_all/1' download target='_blank'><Button>Скачать полный отчет</Button></a>
            <Input.Search
      placeholder="Поиск"
      allowClear
      style={{ width: 200, margin: '0 10px' }}
      onSearch={searchHandler}
    />
            <table className='report__table'>
                <thead>
                    <tr>
                        <th>Учреждение</th>
                        <th>Руководитель</th>
                        <th>Район</th>
                    </tr>
                </thead>
                <tbody>
                    {reportsData && Array.isArray(reportsData.children) && reportsData.children.map(el => {
                        return (
                            <tr>
                                <td><Link to={`/institution/view/${el.id}`}>{el.name || 'Не указано'}</Link></td> 
                                <td>{(el.lead && el.lead.name) || 'Не указано'}</td>
                                <td>{(el.district && el.district.name) || 'Не указано'}</td>
                            </tr>
                        )
                    })}
                    
                </tbody>
            </table>
            {Array.isArray(reportsData.children) && reportsData.total>30 && <Pagination defaultCurrent={reportsData.reportPage} total={reportsData.total} onChange={paginationHandler} showSizeChanger={false}  defaultPageSize='30'/>}
        </div>
    )
}

export default InstReport
