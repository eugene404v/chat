import React from 'react'
import {Form, Button} from 'antd'
import {useDispatch, useSelector} from 'react-redux'
import {useParams} from 'react-router-dom'

import {EditableText, EditableNum, EditableSelect} from "components";
import { fetchSpecialist, refreshSpecialist, fetchSelects, addSpecialist } from 'redux/reducers/specialistReducer';

function CreateSpecialist() {
    const dispatch = useDispatch()
    const specData = useSelector(state => state.specialistReducer)
    const [edit, setEdit] = React.useState(true)

React.useEffect(()=> {
    dispatch(fetchSelects(9, 18, 20, 21, 22))
}, [dispatch])

    const onFinish = values => {
        dispatch(addSpecialist(values))
    };

    return (
        <div>
             <h1>СОЗДАТЬ КАРТУ СПЕЦИАЛИСТА</h1>
             {specData.isLoaded && <Form onFinish={onFinish} initialValues={{ 
                fio: '',
                district: '',
                institution: '',
                phone: '',
                email: '',
                job: '',
                jobChar: '',
                jobType: '',
                jobExperience: '',
                remember: true,
        }} >
            <EditableText descr='ФИО' text='' access={edit} fieldName='fio'/>
            <EditableSelect descr='Район' text='' access={edit} selectArray={specData.districtsArr} fieldName='district' />
            <EditableSelect descr='Организация' text='' access={edit} selectArray={specData.institutionsArr} fieldName='institution' />
            <EditableText descr='Телефон' text='' access={edit} fieldName='phone'/>
            <EditableText descr='Почта' text='' access={edit} fieldName='email'/>
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
                        <EditableSelect descr='' text='' access={edit} selectArray={specData.allJobs} fieldName='job'/>
                        </td>
                        <td><EditableSelect placeholder='wwwwwwwwwwwwwww' descr='' text='' access={edit} selectArray={specData.allJobChars} fieldName='jobChar'/></td>
                        <td><EditableSelect descr='' text='' access={edit} selectArray={specData.allJobTypes} fieldName='jobType'/></td>
                        <td><EditableNum descr='' text='' access={edit} fieldName='jobExperience'/></td>
                    </tr>
                </tbody>
            </table>
            {edit && <Button  type="primary" htmlType="submit">Сохранить изменения</Button>}
        </Form>}

        </div>
    )
}

export default CreateSpecialist
