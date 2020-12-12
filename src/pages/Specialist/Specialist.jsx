import React from 'react'
import {Form, Button} from 'antd'
import {useDispatch, useSelector} from 'react-redux'
import {useParams} from 'react-router-dom'

import {EditableText, EditableNum, EditableSelect} from "components";
import { editSpecialist, fetchSpecialist, refreshSpecialist, fetchSelects } from 'redux/reducers/specialistReducer';

function Specialist() {
    const dispatch = useDispatch()
    const specData = useSelector(state => state.specialistReducer)
    const [edit, setEdit] = React.useState(false)
    const urlId = useParams().id

    React.useEffect(()=> {
        dispatch(refreshSpecialist())
        dispatch(fetchSpecialist(urlId))
    }, [dispatch])

    const editHandler = () => {
      if (edit === false) {
          dispatch(fetchSelects(specData._guideFields.institution.fromId, specData._guideFields.district.fromId, specData._guideFields.job.fromId, specData._guideFields.jobChar.fromId, specData._guideFields.jobType.fromId))
        setEdit(true)
      } else {
        setEdit(false)
      }
    }
    


    const onFinish = values => {
        dispatch(editSpecialist(values, urlId))
    };


    return (
        <section className="specialist">
            <h1>КАРТА СПЕЦИАЛИСТА</h1>
            <Button onClick={editHandler}>change access</Button>
        {specData.isLoaded && <Form onFinish={onFinish} initialValues={{ 
                fio: specData.fio,
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
            <EditableText descr='ФИО' text={specData.fio} access={edit} fieldName='fio'/>
            <EditableSelect descr='Район' text={specData.district.name} access={edit} selectArray={specData.districtsArr} fieldName='district' />
            <EditableSelect descr='Организация' text={specData.institution.name} access={edit} selectArray={specData.institutionsArr} fieldName='institution' />
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
                        <EditableSelect descr='' text={specData.job.name} access={edit} selectArray={specData.allJobs} fieldName='job'/>
                        </td>
                        <td><EditableSelect descr='' text={specData.jobChar.name} access={edit} selectArray={specData.allJobChars} fieldName='jobChar'/></td>
                        <td><EditableSelect descr='' text={specData.jobType.name} access={edit} selectArray={specData.allJobTypes} fieldName='jobType'/></td>
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
