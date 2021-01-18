import React from 'react'
import {useSelector, useDispatch} from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { Pagination, Button, Select, Form, DatePicker, Switch, Input } from 'antd';
import axios from 'axios'
import moment from 'moment'
import './reports.scss'


import {fetchChildrenSelects, fetchChildrenReport, downloadReport, searchChildrenReport} from 'redux/reducers/childrenReportReducer'
import { FilterOutlined } from '@ant-design/icons';
import AsyncSelect from 'components/Editable/AsyncSelect';

function ChildrenReport() {
    const history = useHistory()
    const dispatch = useDispatch()
    const reportsData = useSelector(state=>state.childrenReportReducer)
    const userData = useSelector(state => state.userReducer)
    const [excel, setExcel] = React.useState()
    const [filter, setFilter] = React.useState(false)
    const [access, setAccess] = React.useState(false)
    const [inst, setInst] = React.useState()
    const [excelLink, setExcelLink] = React.useState()
    const [formFilters, setFormFilters] = React.useState()

    React.useEffect(() => {
        dispatch(fetchChildrenSelects())
        dispatch(fetchChildrenReport({archived: 0}, reportsData.reportPage))
        //dispatch(clearFilters())
        if (userData.lvl==='admin' || userData.lvl === 'region') {
            setAccess(true)
          }
    }, [dispatch, userData.lvl])

    const paginationHandler = (page) => {
        dispatch(fetchChildrenReport(reportsData.filters, page))
    }

    const onSelectHandler = (val) => {
        setInst(val)
    }


    const showReportHandler = (vals) => {
       dispatch(fetchChildrenReport(vals, 1, true,inst))
        setExcel(true)
    }

    const showFiltersHandler = () => {
        filter ? setFilter(false) : setFilter(true)
    }

    const excelHandler = () => {
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
        axios
          .post(`/children/detailedReport/excel`, formdata, {
            headers: {
              Accept: "text/json",
            },
          })
          .then(function (response) {
                history.push(response.data.file)
          });
    }

    const searchHandler = (val, e) => {
        dispatch(searchChildrenReport(val))
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
        axios.post(`/children/detailedReport/excel/1`, formdata, {headers: {accept: 'text/json'}} )
        .then(resp => setExcelLink(resp.data.file))
    }

    return (
        <div>
            <h1>Выборочный отчет по картам детей</h1>
            <Button onClick={showFiltersHandler}><FilterOutlined />Фильтр</Button>
            <Input.Search
      placeholder="Поиск"
      allowClear
      onSearch={searchHandler}
      style={{ width: 200, margin: '0 10px' }}
    />
    <br/><br/>
     <a href='/children/detailedReport/excel_all/1' download><Button>Скачать полный отчет</Button></a>
    
            
            
            {filter && <Form onFinish={showReportHandler} initialValues={{archived: 0}} className='filter' labelCol={{span: 10, offset: 0}} >

                <Form.Item name='institution' label='Учреждение' className='filter__item '>
                    <AsyncSelect type='institution'  onSelectHandler={onSelectHandler}/>
                </Form.Item>
                <Form.Item name='disability' label='Ограниченные возможности здоровья' className='filter__item '>
                    <Switch />
                </Form.Item>
                <Form.Item name='invalid' label='Инвалидность' className='filter__item '>
                    <Switch />
                </Form.Item>
                <Form.Item name='alcoholism' label='Алкогольная зависимость' className='filter__item '>
                    <Switch />
                </Form.Item>
                <Form.Item name='smoking' label='Табачная зависимость' className='filter__item '>
                    <Switch />
                </Form.Item>
                <Form.Item name='drugs' label='Наркотическая зависимость' className='filter__item '>
                    <Switch />
                </Form.Item>
                <Form.Item name='other' label='Иная зависимость' className='filter__item '>
                    <Switch />
                </Form.Item>
                {/*<Form.Item name='asylum' label='Учреждение для детей оставшихся без попечения' className='filter__item '>
                    <Switch />
                    </Form.Item>*/}
                <Form.Item name='childProfType' label='Тип профилактического учета' className='filter__item '>
                    <Select placeholder='Тип проф.учета'>
                        {reportsData.childProfTypesArr && reportsData.childProfTypesArr.map((el) => {
                            return <Select.Option value={el.id} key={el.name} title={el.name}>{el.name}</Select.Option>;
                        })}
                    </Select>
                </Form.Item>
                {/*<Form.Item name='child_prof_reasonStart' label='Причина постановки на проф.учет' className='filter__item '>
                    <Select placeholder='Причина постановки на проф.учет'>
                        {reportsData.child_prof_reasonStartArr && reportsData.child_prof_reasonStartArr.map((el) => {
                            return <Select.Option value={el.id} key={el.name} title={el.name}>{el.name}</Select.Option>;
                        })}
                    </Select>
                </Form.Item>
                <Form.Item name='child_prof_dateStart' label='Дата постановки на проф.учет' className='filter__item '>
                    <DatePicker />
                </Form.Item>
                <Form.Item name='child_prof_reasonEnd' label='Причина снятия с проф.учета' className='filter__item '>
                    <Select placeholder='Причина снятия с проф.учета'>
                        {reportsData.child_prof_reasonEndArr && reportsData.child_prof_reasonEndArr.map((el) => {
                            return <Select.Option value={el.id} key={el.name} title={el.name}>{el.name}</Select.Option>;
                        })}
                    </Select>
                </Form.Item>
                <Form.Item name='child_prof_dateEnd' label='Дата снятия с проф.учета' className='filter__item '>
                    <DatePicker />
                </Form.Item>*/}
                <Form.Item name='article' label='Статья правонарушения' className='filter__item '>
                    <Select placeholder='Статья правонарушения'>
                        {reportsData.articlesArr && reportsData.articlesArr.map((el) => {
                            return <Select.Option value={el.id} key={el.name} title={el.name}>{el.name}</Select.Option>;
                        })}
                    </Select>
                </Form.Item>
                <Form.Item name='childWorkType' label='Вид занятости' className='filter__item '>
                    <Select placeholder='Вид занятости'>
                        {[{id:'Трудоустройство', name:'Трудоустройство'},{id:'Дополнительное образование', name:'Дополнительное образование'},{id:'Общественное объединение', name:'Общественное объединение'}].map((el) => {
                            return <Select.Option value={el.id} key={el.name} title={el.name}>{el.name}</Select.Option>;
                        })}
                    </Select>
                </Form.Item>
                <Form.Item name='childEscape' label='Ребенок выбыл' className='filter__item '>
                    <Switch />
                </Form.Item>
                <Form.Item name='childIndividual' label='Наличие ИПР' className='filter__item '>
                    <Switch />
                </Form.Item>
                {access ? <Form.Item name='archived' label='Архивирована' className='filter__item filter__item--last'>
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
            {reportsData && Array.isArray(reportsData.children) ? <table className='report__table'>
                <thead>
                    <tr>
                        <th>ФИО ребенка</th>
                        <th>Организация</th>
                        <th>Дата рождения</th>
                    </tr>
                </thead>
                <tbody>
                    {reportsData && Array.isArray(reportsData.children) && reportsData.children.map(el => {
                        return (
                            <tr className={`report__row${el.archived ? ' report__row--archive1111d' : ''}${el.errors ? ' report__row--error11111' : ''}`}>
                                <td>{el.name ? <Link to={`/children/view/${el.id}`}>{el.name}</Link> : <Link to={`/children/view/${el.id}`}>Не указано</Link>}</td> 
                                <td>{el.institution ? <Link to={`/institution/view/${el.institution.id}`}>{el.institution.name}</Link> : 'Не указано'}</td> 
                                <td>{el.birthDate !== '0000-00-00' ? moment(el.birthDate).format('DD-MM-YYYY').toString() : 'Не указана'}</td>
                            </tr>
                        )
                    })}
                    
                </tbody>
            </table> : (Array.isArray(reportsData.children) &&reportsData.children.length<1 ? <p>Ничего не найдено</p> : <p>Выберите фильтры</p>)}
            {Array.isArray(reportsData.children) && reportsData.total>30 && <Pagination defaultCurrent={reportsData.reportPage} total={reportsData.total} onChange={paginationHandler} showSizeChanger={false}  defaultPageSize='30'/>}
        </div>
    )
}

export default ChildrenReport
