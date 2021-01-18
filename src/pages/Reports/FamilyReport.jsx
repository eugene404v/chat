import React from 'react'
import {useSelector, useDispatch} from 'react-redux'
import { Link } from 'react-router-dom'
import { Pagination, Button, Select, Form, DatePicker, Switch, Input } from 'antd';
import moment from 'moment'
import axios from 'axios'

import {fetchFamilySelects, fetchFamilyReport, downloadFamilyReport, clearFamilyReport, searchParentsReport} from 'redux/reducers/familyReportReducer'
import { FilterOutlined } from '@ant-design/icons';
import './reports.scss'
import { idFormatter } from 'redux/utils/idFormatter';

function FamilyReport() {
    const dispatch = useDispatch()
    const reportsData = useSelector(state=>state.familyReportReducer)
    const [excel, setExcel] = React.useState()
    const [filter, setFilter] = React.useState(false)
    const userData = useSelector(state => state.userReducer)
    const [access, setAccess] = React.useState(false)
    const [excelLink, setExcelLink] = React.useState()



    React.useEffect(() => {
        dispatch(fetchFamilySelects())
        dispatch(fetchFamilyReport({archived: 0}, 1))
        if (userData.lvl==='admin' || userData.lvl === 'region') {
            setAccess(true)
          }
    }, [dispatch, userData.lvl])

    const paginationHandler = (page) => {
        dispatch(clearFamilyReport())
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
        axios.post(`/family/detailedReport/excel/1`, formdata, {headers: {accept: 'text/json'}} )
        .then(resp => setExcelLink(resp.data.file))
    }

    return (
        <div>
            <h1>Выборочный отчет по картам семей</h1>
            <Button onClick={showFiltersHandler}><FilterOutlined />Фильтр</Button> 
            <Button  className='filter__excel'><a href='/family/detailedReport/excel_all/1' download target='_blank'>Скачать полный отчет</a></Button> 
            <Input.Search
            onSearch={searchHandler}
      placeholder="Поиск"
      allowClear
      style={{ width: 200, margin: '0 10px' }}
    />
            {filter && <Form onFinish={showReportHandler} initialValues={{archived: 0}} className='filter' labelCol={{span: 10, offset: 0}} >
                <Form.Item name='manyChildren' label='Многодетная' className='filter__item '>
                    <Switch />
                </Form.Item>
                <Form.Item name='alcoholism' label='Родители злоупотребляют алкоголем' className='filter__item '>
                    <Switch />
                </Form.Item>
                <Form.Item name='drugs' label='Родители злоупотребляют ПАВ' className='filter__item '>
                    <Switch />
                </Form.Item>
                <Form.Item name='familyType' label='Вид семьи' className='filter__item '>
                    <Select placeholder='Тип семьи'>
                        {reportsData.familyTypesArr && reportsData.familyTypesArr.map((el) => {
                            return <Select.Option value={el.id} key={el.name} title={el.name}>{el.name}</Select.Option>;
                        })}
                    </Select>
                </Form.Item>
                <Form.Item name='familyFeatures' label='Особенности семьи' className='filter__item '>
                    <Select placeholder='Особенности семьи'>
                        {reportsData.familyFeaturesArr && reportsData.familyFeaturesArr.map((el) => {
                            return <Select.Option value={el.id} key={el.name} title={el.name}>{el.name}</Select.Option>;
                        })}
                    </Select>
                </Form.Item>
                <Form.Item name='familySop' label='СОП' className='filter__item '>
                    <Switch />
                </Form.Item>
                <Form.Item name='familySop_dateStart' label='Дата начала СОП' className='filter__item '>
                    <DatePicker placeholder='Дата начала СОП'/>
                </Form.Item>
                <Form.Item name='familySop_dateEnd' label='Дата окончания СОП' className='filter__item '>
                    <DatePicker placeholder='Дата окончания СОП'/>
                </Form.Item>
                <Form.Item name='familyMpr' label='МПР' className='filter__item '>
                    <Switch />
                </Form.Item>
                <Form.Item name='familyMpr_dateStart' label='Дата начала МПР' className='filter__item '>
                    <DatePicker placeholder='Дата начала МПР'/>
                </Form.Item>
                <Form.Item name='familyMpr_dateEnd' label='Дата окончания МПР' className='filter__item '>
                    <DatePicker placeholder='Дата окончания МПР'/>
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
                        <th>Семья</th>
                        <th className='report__td--max200'>Родитель злоупотреляет алкоголем</th>
                        <th className='report__td--max200'>Родитель злоупотреляет ПАВ</th>
                        <th>Тип семьи</th>
                        <th>Особенности семьи</th>
                    </tr>
                </thead>
                <tbody>
                    {reportsData && Array.isArray(reportsData.children) && reportsData.children.map((el, i) => {
                        return (
                            <tr className={`report__row`}>
                                <td><Link to={`/family/view/${el.id}`}>{idFormatter(el.id)}</Link></td> 
                                <td className='report__td--max200'>{el.alcoholism?'Да':'Нет'}</td>
                                <td className='report__td--max200'>{el.drugs?'Да':'Нет'}</td>
                                <td>{el.familyType?el.familyType.name:'Не указан'}</td>
                                <td>{el.familyFeatures?el.familyFeatures.name:'Не указан'}</td>
                            </tr>
                        )
                    })}
                    
                </tbody>
            </table>
            {Array.isArray(reportsData.children) && reportsData.total>30 && <Pagination defaultCurrent={reportsData.reportPage} total={reportsData.total} onChange={paginationHandler} showSizeChanger={false}  defaultPageSize='30'/>}
        </div>
    )
}

export default FamilyReport
