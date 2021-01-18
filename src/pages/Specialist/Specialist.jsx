import React from 'react'
import {Form, Button} from 'antd'
import {useDispatch, useSelector} from 'react-redux'
import {useParams} from 'react-router-dom'

import {EditableText, EditableNum, EditableSelect, AsyncSelect} from "components";
import { editSpecialist, fetchSpecialist, refreshSpecialist, fetchSelects } from 'redux/reducers/specialistReducer';
import { EditOutlined } from "@ant-design/icons";
import { setDistr } from 'redux/reducers/reportsReducer';
import axios from 'axios';

function Specialist() {
    
    const dispatch = useDispatch()
    const [access, setAccess] = React.useState(false)
    const [inst, setInst] = React.useState()
    const specData = useSelector(state => state.specialistReducer)
    const userData = useSelector(state => state.userReducer)
    const [edit, setEdit] = React.useState(false)
    const urlId = useParams().id
    const [distr, setDistr] = React.useState(specData.district && specData.district.id)
    const [instArr, setInstArr] = React.useState()

    React.useEffect(()=> {
        dispatch(refreshSpecialist())
        dispatch(fetchSpecialist(urlId))
        if (userData.lvl==='admin' || userData.lvl === 'region'|| userData.lvl === 'master'|| userData.lvl === 'curator') {
            setAccess(true)
          }
    }, [dispatch,userData.lvl,urlId])

    const editHandler = () => {
      if (edit === false) {
          dispatch(fetchSelects(specData._guideFields.institution.fromId, specData._guideFields.district.fromId, specData._guideFields.job.fromId, specData._guideFields.jobChar.fromId, specData._guideFields.jobType.fromId))
        setEdit(true)
      } else {
        setEdit(false)
      }
    }

    const distrHandler  = (val) => {
        setDistr(val)
    }

    const loadDistr = () => {
        axios.get(`/institution/search?search_by=district&search=${distr}`, {
            headers: {
                Accept: 'text/json'
            }
        }).then(resp=>setInstArr(resp.data.data))
    }
  
    const onSelectHandler = (val) => {
        
    }
    
    const onFinish = (values) => {
        dispatch(editSpecialist(values, urlId, inst))
        setEdit(false)
    };


    return (
        <section className="specialist">
            <h1>КАРТА СПЕЦИАЛИСТА</h1>
            {access && <Button onClick={editHandler}><EditOutlined/>Редактировать</Button>}
        {specData.isLoaded && <Form onFinish={onFinish} initialValues={{ 
                last_name: specData.fio && specData.fio.split(' ')[0],
                first_name: specData.fio && specData.fio.split(' ')[1],
                middle_name: specData.fio && specData.fio.split(' ')[2],
                district: specData.district.id,
                institution: specData.institution.id,
                phone: specData.phone,
                email: specData.email,
                job: specData.job.id,
                jobChar: specData.jobChar.id,
                jobType: specData.jobType.id,
                jobExperience: specData.jobExperience,
                remember: true,
        }} >
            <EditableText descr='Фамилия' text={specData.fio && specData.fio.split(' ')[0]} access={edit} fieldName='last_name' required={true} errMsg='Заполните поле'/>
            <EditableText descr='Имя' text={specData.fio && specData.fio.split(' ')[1]} access={edit} fieldName='first_name' required={true} errMsg='Заполните поле'/>
            <EditableText descr='Отчество' text={specData.fio && specData.fio.split(' ')[2]} access={edit} fieldName='middle_name' required={true} errMsg='Заполните поле'/>
            <EditableSelect descr='Район' text={specData.district.name} access={edit} selectArray={specData.districtsArr} fieldName='district' onSelect={distrHandler}/>
            <EditableSelect disabled={!distr} descr='Организация' text={specData.district.name} access={edit} selectArray={instArr} fieldName='institution' onFocus={loadDistr}/>
            {/*edit ? <Form.Item fieldName="institution"> 
                <div className="editable"><div className="pair"><div className="pair__descr">Организация</div><div className="pair__value"></div></div>
                    <AsyncSelect type='institution' onSelectHandler={onSelectHandler}/>
                </div>
    </Form.Item> : <div class="editable"><div class="pair"><div class="pair__descr">Учреждение</div><div class="pair__value">{specData.institution && specData.institution.name}</div></div></div>*/} 
            <EditableText descr='Телефон' text={specData.phone} access={edit} fieldName='phone'/>
            <EditableText descr='Почта' text={specData.email} access={edit} fieldName='email'/>
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
                        <EditableSelect descr='' text={specData.job} access={edit} selectArray={specData.allJobs} fieldName='job' multiple={true}/>
                        </td>
                        <td><EditableSelect descr='' text={specData.jobType.name} access={edit} selectArray={specData.allJobTypes} fieldName='jobType'/></td>
                        <td><EditableSelect descr='' text={specData.jobChar.name} access={edit} selectArray={specData.allJobChars} fieldName='jobChar'/></td>
                        <td><EditableNum descr='' text={specData.jobExperience} access={edit} fieldName='jobExperience'/></td>
                    </tr>
                </tbody>
            </table>


           
            
            
            {edit && <Button  type="primary" htmlType="submit">Сохранить изменения</Button>}
        </Form>}

        </section>
    )
}

export default Specialist
