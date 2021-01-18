import React from 'react'
import {useSelector, useDispatch} from 'react-redux'
import { Link } from 'react-router-dom'
import { Pagination, Button, Select } from 'antd';
import './reports.scss'

import {fetchCommonSelects, fetchCommonReport, clearFilters, setProf, setInst, clearCommonReport, setArchive, downloadReport, fetchInstsByDistr, setDistr } from 'redux/reducers/reportsReducer'
import axios from 'axios';
import moment from 'moment'


function CommonReports(props) {
    const dispatch = useDispatch()
    const reportsData = useSelector(state=>state.reportsReducer)
    const [excel, setExcel] = React.useState()
    const userData = useSelector(state => state.userReducer)
    const [access, setAccess] = React.useState(false)
    const [filteredExcel, setFilteredExcel] = React.useState()
    const [excelAll, setExcelAll] = React.useState()

    React.useEffect(() => {
        dispatch(fetchCommonSelects())
        dispatch(clearFilters())
        dispatch(fetchInstsByDistr(1))
        dispatch(fetchCommonReport('', '', '',  0, 1))
        if (userData.lvl==='admin' || userData.lvl === 'region') {
            setAccess(true)
          }
        
    }, [dispatch, userData.lvl])

    const paginationHandler = (page) => {
        dispatch(clearCommonReport())
        dispatch(fetchCommonReport(reportsData.prof, reportsData.inst, reportsData.distr, 0, page))
    }

    const profsHandler = (id) => {
        dispatch(setProf(id))
    }

    const distrHandler = (distrId) => {
        dispatch(setDistr(distrId))
        dispatch(fetchInstsByDistr(distrId))
    } 

    const instHandler = (id) => {
        dispatch(setInst(id))
    }
    const showReportHandler = () => {
        dispatch(fetchCommonReport(reportsData.prof, reportsData.inst, reportsData.archived, reportsData.distr, reportsData.reportPage))
        setExcel(true)
    }
    const archiveHandler = (id) => {
        dispatch(setArchive(id))
    }
    const excelHandler = () => {
        dispatch(downloadReport(reportsData.prof, reportsData.inst, reportsData.archived))
    }
    const excelReportHandler =() => {
        var formdata = new FormData();
        reportsData.prof && formdata.append('childProfType', reportsData.prof);
        reportsData.inst && formdata.append('institution', reportsData.inst);
        reportsData.archived && formdata.append('archived', reportsData.archived);
        reportsData.distr && formdata.append('district', reportsData.distr);
        axios.post(`/children/commonReport/excel/1`, formdata, {headers: {accept: 'text/json'}})
        .then(resp => setFilteredExcel(resp.data.file))
    }

    return (
        <div>
            <h1>Сводный отчет по сведениям из карт детей</h1>
            <Select onSelect={profsHandler} placeholder='Тип проф учета'>
                {reportsData.childProfTypesArr && reportsData.childProfTypesArr.map((el) => {
                    return <Select.Option value={el.id} key={el.name} title={el.name}>{el.name}</Select.Option>;
                })}
            </Select>
            <Select onSelect={distrHandler} placeholder='Район' style={{minWidth: '200px'}}>
                {reportsData.districtsArr && reportsData.districtsArr.map((el) => {
                    return <Select.Option value={el.id} key={el.name} title={el.name}>{el.name}</Select.Option>;
                })}
            </Select>
            <Select onSelect={instHandler} placeholder='Учреждение' disabled={!reportsData.distr} style={{minWidth: '480px'}}>
                {reportsData.childInstArr && reportsData.childInstArr.map((el) => {
                    return <Select.Option value={el.id} key={el.name} title={el.name}>{el.name}</Select.Option>;
                })}
            </Select>
            {access && <Select onSelect={archiveHandler} placeholder='Архивирована'>
                {[{id: 0, name:'Не архивные'},{id: 1, name:'Все'},{id: 2, name:'Только архивные'}].map((el) => {
                    return <Select.Option value={el.id} key={el.name} title={el.name}>{el.name}</Select.Option>;
                })}
            </Select>}
            <br/>
            <br/>
            <Button onClick={showReportHandler} type='primary'>Показать отчет</Button>
            <a href={`/children/commonReport/excel_all/1`} download><Button onClick={excelHandler}>Скачать полный отчет</Button></a>
            <Button onClick={excelReportHandler}>{'Сформировать выборочный отчет для скачивания'}</Button>
            {filteredExcel && <a href={filteredExcel} download><Button type='primary'>Скачать сформированный отчет</Button></a>} 
            <br/>
            <br/>
            <table  className='report__table'>
                <thead>
                    <tr>
                        <th>ФИО ребенка</th>
                        <th>Дата рождения</th>
                        <th>Вид проф. учета</th>
                        <th>ОО</th>
                    </tr>
                </thead>
                <tbody>
                    {reportsData && Array.isArray(reportsData.children) && reportsData.children.map(el => {
                        return (
                            <tr className={`report__row`}>
                                <td><Link to={`/children/view/${el.id}`}>{el.name || 'Не указано'}</Link></td>
                                <td>{el.birthDate && moment(el.birthDate).format('DD-MM-YYYY').toString()}</td>
                                <td>{(el.childProf && el.childProf[0] && el.childProf[0].type && el.childProf[0].type.name) || 'Не указано'}</td>
                                <td>{(el.institution && el.institution.name) || 'Не указано'}</td>
                            </tr>
                        )
                    })}
                    
                </tbody>
            </table>
            
            {Array.isArray(reportsData.children) && reportsData.total>30 && <Pagination defaultCurrent={reportsData.reportPage} total={reportsData.total} onChange={paginationHandler} showSizeChanger={false}  defaultPageSize='30'/>}
        </div>
    )
}

export default CommonReports
