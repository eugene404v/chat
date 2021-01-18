import React from 'react'
import {useSelector, useDispatch} from 'react-redux'
import { Link } from 'react-router-dom'
import { Pagination, Button, Select, Form, DatePicker, Switch, Input } from 'antd';
import moment from 'moment'
import axios from 'axios'

import {fetchFamilySelects, fetchFamilyReport, downloadFamilyReport, searchParentsReport} from 'redux/reducers/parentsReportReducer'
import { FilterOutlined } from '@ant-design/icons';
import './reports.scss'

function ParentsReport() {
    const dispatch = useDispatch()
    const reportsData = useSelector(state=>state.parentsReportReducer)
    const [excel, setExcel] = React.useState()
    const [filter, setFilter] = React.useState(false)
    const userData = useSelector(state => state.userReducer)
    const [access, setAccess] = React.useState(false)
    const [excelLink, setExcelLink] = React.useState()

    React.useEffect(() => {
        dispatch(fetchFamilySelects())
        dispatch(fetchFamilyReport({archived: 0}, reportsData.reportPage))
        if (userData.lvl==='admin' || userData.lvl === 'region') {
            setAccess(true)
          }
    }, [dispatch, userData.lvl])

    const paginationHandler = (page) => {
        //dispatch(clearFamilyReport())
        dispatch(fetchFamilyReport(reportsData.filters, page))
    }


    const showReportHandler = (vals) => {
       dispatch(fetchFamilyReport(vals, 1, true))

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

    const detailedExcelHandler = () => {
        var formdata = new FormData();
        const data = reportsData.filters
        let key;
        for (key in data) {
          if (data[key] !== undefined && data[key] !== 'no') {
            if (
              key !== "birthDate" &&
              key !== "child_prof_dateStart" &&
              key !== "child_prof_dateEnd"
            ) {
              formdata.append(key, data[key]);
            } else if (
              key === "birthDate" ||
              key === "child_prof_dateStart" ||
              key === "child_prof_dateEnd"
            ) {
              formdata.append(key, moment(data[key]).format("YYYY-MM-DD").toString());
            }
          } 
        }
        axios.post(`/parents/detailedReport/excel/1`, formdata, {headers: {accept: 'text/json'}} )
        .then(resp => setExcelLink(resp.data.file))
    }

    return (
        <div>
            <h1>Выборочный отчет по картам родителей</h1>
            <Button onClick={showFiltersHandler}><FilterOutlined />Фильтр</Button> <Button  className='filter__excel'><a href='/parents/detailedReport/excel_all/1' download target='_blank'>Скачать полный отчет</a></Button> 
            <Input.Search
            onSearch={searchHandler}
      placeholder="Поиск"
      allowClear
      style={{ width: 200, margin: '0 10px' }}
    />
            
            
            {filter && <Form onFinish={showReportHandler} initialValues={{archived: 0}} className='filter' labelCol={{span: 10, offset: 0}}>
                <Form.Item name='alcoholism' label='Злоупотребляет алкоголем' className='filter__item '>
                    <Switch />
                </Form.Item>
                <Form.Item name='drugs' label='Злоупотребляет ПАВ' className='filter__item '>
                    <Switch />
                </Form.Item>
                <Form.Item name='lowerRights' label='Ограничен в правах' className='filter__item '>
                    <Switch />
                </Form.Item>
                <Form.Item name='deprivedRights' label='Лишен родительских прав' className='filter__item '>
                    <Switch />
                </Form.Item>
                <Form.Item name='solitude' label='Проживает отдельно' className='filter__item '>
                    <Switch />
                </Form.Item>
                <Form.Item name='prison' label='Судимость' className='filter__item '>
                    <Switch />
                </Form.Item>
                <Form.Item name='birthDate' label='Дата рождения' className='filter__item '>
                    <DatePicker placeholder='Дата рождения' />
                </Form.Item>
                <Form.Item name='crimes' label='Правонарушения' className='filter__item '>
                    <Switch />
                </Form.Item>
                <Form.Item name='crimeType' label='Тип правонарушения' className='filter__item '>
                    <Select  placeholder='Тип правонарушения'>
                        {[{id: 'Административное', name:'Административное'},{id: 'Уголовное', name:'Уголовное'}].map((el) => {
                            return <Select.Option value={el.id} key={el.name} title={el.name}>{el.name}</Select.Option>;
                        })}
                    </Select>
                </Form.Item>
                {access ? <Form.Item name='archived' label='Архивирована' className='filter__item '>
                    <Select placeholder='Архивирована'>
                        {[{id: 0, name:'Нет'},{id: '2', name:'Да'},{id: 1, name:'Все'}].map((el) => {
                            return <Select.Option value={el.id} key={el.name} title={el.name}>{el.name}</Select.Option>;
                        })}
                    </Select>
                </Form.Item> : <Form.Item name='archived' style={{display: 'none'}}/>}
                <div style={{display: 'inline-block'}}>
                    <Button  type="primary" htmlType="submit">Показать отчет</Button>
                    <Button disabled={!excel} onClick={detailedExcelHandler}>Сформировать выборочный отчет</Button>
                    {excelLink && <a href={excelLink} download><Button>Скачать выборочный отчет</Button></a>}
                </div>
            </Form>}
            <table className='report__table'>
                <thead>
                    <tr>
                        <th>ФИО</th>
                        <th>Дата рождения</th>
                    </tr>
                </thead>
                <tbody>
                    {reportsData && Array.isArray(reportsData.children) && reportsData.children.map(el => {
                        return (
                            <tr className={`report__row`}>
                                <td><Link to={`/parents/view/${el.id}`}>{el.name}</Link></td>
                                <td>{el.birthDate !== '0000-00-00' ? moment(el.birthDate).format('DD-MM-YYYY').toString() : 'Не указана'}</td>
                            </tr>
                        )
                    })}
                    
                </tbody>
            </table>
            {Array.isArray(reportsData.children) && reportsData.total>30 && <Pagination defaultCurrent={reportsData.reportPage} total={reportsData.total} onChange={paginationHandler} showSizeChanger={false}  defaultPageSize='30'/>}
        </div>
    )
}

export default ParentsReport
