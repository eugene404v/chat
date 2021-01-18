import React from 'react'
import {Form, Button, Select} from 'antd'
import {useDispatch, useSelector} from 'react-redux'
import {useParams} from 'react-router-dom'
import axios from 'axios'
import {useHistory} from 'react-router-dom'
import {EditableText, EditableNum, EditableSelect, AsyncSelect} from "components";
import { fetchSpecialist, refreshSpecialist, fetchSelects, addSpecialist } from 'redux/reducers/specialistReducer';

function CreateSpecialist() {
    const dispatch = useDispatch()
    const specData = useSelector(state => state.specialistReducer)
    const userData = useSelector(state => state.userReducer)
    const [edit, setEdit] = React.useState(true)
    const [access, setAccess] = React.useState(false)
    const [inst, setInst] = React.useState()
    const history = useHistory()
    const [distr, setDistr] = React.useState()
    const [instArr, setInstArr] = React.useState()

React.useEffect(()=> {
    dispatch(fetchSelects(9, 18, 20, 21, 22))
    if (userData.lvl==='admin' || userData.lvl === 'region'|| userData.lvl === 'master'|| userData.lvl === 'curator') {
        setAccess(true)
      }
}, [dispatch, userData.lvl])

    const onFinish = data => {
        var formdata = new FormData();
        let key
        for (key in data){
            formdata.append(key, data[key])
        }
        formdata.append('institution', inst)
        axios.post(`/users/userAdd/`,formdata, {
            headers: {
              Accept: "text/json",
              'Content-Type': 'multipart/form-data'
            },
          })
          .then(function (response) {
            if (response.data.success === true) {
                alert('Специалист создан')
              } else {
                  console.log(response.data.info)
                alert("Ошибка")
              }
          });
    };

    const distrHandler = (val) => {
        setDistr(val)
    }

    const instLoadHandler = () => {
        axios.get(`/institution/search?search_by=district&search=${distr}`, {
            headers: {
                Accept: 'text/json'
            }
        }).then(resp=>setInstArr(resp.data.data))
    }


    return (
        <div>
             <h1>СОЗДАТЬ КАРТУ СПЕЦИАЛИСТА</h1>
             {specData.isLoaded && <Form onFinish={onFinish} initialValues={{ 
               last_name: '',
               first_name: '',
               middle_name: '',
                district: '',
                institution: '',
                phone: '',
                email: '',
                job: '',
                jobChar: '',
                jobType: '',
                jobExperience: '',
                remember: true,
                type: '',
                name: '',
                password: '',
                password_confirm: ''
        }} >
            <EditableText descr='Фамилия' text='' access={edit} fieldName='last_name' required={true} errMsg='Заполните поле'/>
            <EditableText descr='Имя' text='' access={edit} fieldName='first_name' required={true} errMsg='Заполните поле'/>
            <EditableText descr='Отчество' text='' access={edit} fieldName='middle_name' required={true} errMsg='Заполните поле'/>
            {/*access && <EditableText descr='Логин' text='' access={edit} fieldName='name' placeholder='Если создаете пользователя'/>}
            {access && <EditableText descr='Пароль' password text='' access={edit} fieldName='password' placeholder='Если создаете пользователя'/>}
            {access && <EditableText descr='Повторите пароль' password text='' access={edit} fieldName='password_confirm' placeholder='Если создаете пользователя'/>*/}
            <Form.Item fieldName="district"> 
                <div className="editable"><div className="pair"><div className="pair__descr">Район</div><div className="pair__value"></div></div>
                    <Select onSelect={distrHandler} placeholder={'Район'}>
                        {specData.districtsArr && specData.districtsArr.map((el) => {
                            return <Select.Option value={el.id} key={el.name} title={el.name}>{el.name}</Select.Option>;
                        })}
                    </Select>
                </div>
            </Form.Item>
            <Form.Item fieldName="institution"> 
                <div className="editable"><div className="pair"><div className="pair__descr">Организация</div><div className="pair__value"></div></div>
                    {/*<AsyncSelect type='institution' onSelectHandler={onSelectHandler}/>*/}
                    <Select onFocus={instLoadHandler} placeholder={'Организация'} disabled={!distr}>
                        {instArr && instArr.map((el) => {
                            return <Select.Option value={el.id} key={el.name} title={el.name}>{el.name}</Select.Option>;
                        })}
                    </Select>
                </div>
            </Form.Item>
            <EditableText descr='Телефон' text='' access={edit} fieldName='phone'/>
            <EditableText descr='Почта' text='' access={edit} fieldName='email'/>
            {/*access && <EditableSelect descr='Уровень' text='' access={edit} selectArray={specData.rolesArr} fieldName='type' placeholder='Уровень' />*/}
            <table>
                <thead className="ant-table-thead">
                    <tr>
                        <th className="ant-table-cell">Должность</th>
                        <th className="ant-table-cell">Характер работы</th>
                        <th className="ant-table-cell">Вид работы</th>
                        <th className="ant-table-cell">Стаж в должности</th>
                    </tr>
                </thead>
                <tbody className="ant-table-tbody">
                    <tr>
                        <td>
                            <Form.Item name='job'>
                                <Select placeholder='wwwwwwwwww' className='editable__select'>
                                    {specData.allJobs && specData.allJobs.map((el) => {
                                        return <Select.Option value={el.id} key={el.name} title={el.name}>{el.name}</Select.Option>;
                                    })}
                                </Select>
                            </Form.Item>
                        </td>
                        <td>
                            <Form.Item name='jobChar'>
                                <Select placeholder='wwwwwwwwwwwww' className='editable__select'>
                                    {specData.allJobChars && specData.allJobChars.map((el) => {
                                        return <Select.Option value={el.id} key={el.name} title={el.name}>{el.name}</Select.Option>;
                                    })}
                                </Select>
                            </Form.Item>
                        </td>
                        <td>
                            <Form.Item name='jobType'>
                                <Select placeholder='wwwwwwwwwww' className='editable__select'>
                                    {specData.allJobTypes && specData.allJobTypes.map((el) => {
                                        return <Select.Option value={el.id} key={el.name} title={el.name}>{el.name}</Select.Option>;
                                    })}
                                </Select>
                            </Form.Item>
                        </td>
                        <td><EditableNum descr='' text='' access={edit} fieldName='jobExperience'/></td>
                    </tr>
                </tbody>
            </table>
            <br/>
            {edit && <Button  type="primary" htmlType="submit">Сохранить</Button>}
        </Form>}

        </div>
    )
}

export default CreateSpecialist
