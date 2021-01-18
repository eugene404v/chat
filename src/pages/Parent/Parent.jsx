import React from "react";
import axios from 'axios'
import {Form, Button, Table} from 'antd'
import moment from 'moment';
import {useParams} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {fetchParent, refreshParent, editParent, fetchSelects} from 'redux/reducers/parentReducer'

import {EditableText, EditableDate, EditableSelect, PairLink, EditableNum, EditableCheckbox, PairInputBtn, ErrorsList} from "components";
import ParentTable from './ParentTable'
import { EditOutlined } from "@ant-design/icons";






function Parent() {
const urlId = useParams().id
const [edit, setEdit] = React.useState(false)
const dispatch = useDispatch()
const parentData = useSelector(state => state.parentReducer)
const userData = useSelector(state => state.userReducer)
const [access, setAccess] = React.useState(false)

React.useEffect(() => {
    dispatch(refreshParent())
    dispatch(fetchParent(urlId))
    if (userData.lvl==='admin' || userData.lvl === 'region'|| userData.lvl === 'master'|| userData.lvl === 'curator') {
      setAccess(true)
    }
}, [dispatch, urlId, userData.lvl])

const editHandler = () => {
  if (edit === false) {
    setEdit(true)
    dispatch(fetchSelects(parentData._guideFields.documentType.fromId, parentData._guideFields.district.fromId))
  } else {
    setEdit(false)
  }
}

const archiveHandler = (data) => {
  var formdata = new FormData();
  let key;
  for (key in data) {
 
  formdata.append(key, data[key]);

}
  axios.post(`/archiving/requestToArchive/14/${urlId}`, formdata,  {
    headers: {
      Accept: "text/json",
      "Content-Type": "multipart/form-data",
    },
  })
  .then(response => {
    if (response.data.success === true) {
      alert('Запрос на архивацию успешно отправлен')
    }
  })
}

const onFinish = values => {
  dispatch(editParent(values, urlId))
  setEdit(false)
};

const unArchiveHandler = () => {
  axios.post(`/archiving/returnFromArchive/parents/${urlId}`, '', {headers: {Accept: 'text/json'}})
  .then(resp => alert(resp.data.info))
}

  return (
    <section className="home">
      <h1>КАРТА РОДИТЕЛЯ</h1> 
      {Array.isArray(parentData._errors) && parentData._errors.length>0 && <ErrorsList list={parentData._errors}/>}
      {access &&<Button onClick={editHandler}><EditOutlined/>Редактировать</Button>}
{parentData.isLoaded && <Form  onFinish={onFinish} initialValues={{ 
  last_name: parentData.name.split(' ')[0],
      first_name: parentData.name.split(' ')[1],
      middle_name: parentData.name.split(' ')[2],
      birthDate: moment(parentData.birthDate),
      addressReg: parentData.addressReg,
      addressFact: parentData.addressFact,
work: parentData.work,
      documentType: 1,
documentIssuedBy: parentData.documentIssuedBy,
documentNumber: parentData.documentNumber,
documentIssuedDate: moment(parentData.documentIssuedDate),

      district: parentData.district.id,
      
      alcoholism: parentData.alcoholism,
      drugs: parentData.drugs,
      lowerRights: parentData.lowerRights,
      deprivedRights: parentData.deprivedRights,
      solitude: parentData.solitude,
      prison: parentData.prison,


      }} >

      <EditableText descr='Фамилия' text={parentData.name.split(' ')[0]} access={edit} fieldName='last_name' required={true} errMsg='Заполните поле'/>
      <EditableText descr='Имя' text={parentData.name.split(' ')[1]} access={edit} fieldName='first_name' required={true} errMsg='Заполните поле'/>
      <EditableText descr='Отчество' text={parentData.name.split(' ')[2]} access={edit} fieldName='middle_name' required={true} errMsg='Заполните поле'/>
      <EditableDate descr='Дата рождения' day={moment(parentData.birthDate).format('YYYY.MM.DD').toString()} access={edit} fieldName='birthDate'  required={true}/>
      <EditableText descr='Занятость' text={parentData.work} access={edit} fieldName='work'/>
      <EditableText descr='Адрес регистрации' text={parentData.addressReg} access={edit} fieldName='addressReg'/>
      <EditableText descr='Адрес фактического проживания' text={parentData.addressFact} access={edit} fieldName='addressFact'/>

      <EditableText descr='Документ удостоверяющий личность' disabled={true} text='Паспорт' access={false} fieldName='documentType' />
      <EditableText descr='Документ выдан' text={parentData.documentIssuedBy} access={edit} fieldName='documentIssuedBy'/>
      <EditableText descr='Номер и серия документа' text={parentData.documentNumber} access={edit} fieldName='documentNumber'/>
      <EditableDate descr='Дата выдачи документа' day={moment(parentData.documentIssuedDate).format('YYYY.MM.DD').toString()} access={edit} fieldName='documentIssuedDate'/>
      
      <EditableSelect descr='Район' text={parentData.district.name} title={parentData.district.name} access={edit} selectArray={parentData.districtsArr} fieldName='district' />
      <EditableCheckbox descr='Злоупотребляет алкоголем' initialBoolean={parentData.alcoholism} access={edit} fieldName='alcoholism'/>
      <EditableCheckbox descr='Злоупотребляет ПАВ' initialBoolean={parentData.drugs} access={edit} fieldName='drugs'/>
      <EditableCheckbox descr='Ограниченные в правах' initialBoolean={parentData.lowerRights} access={edit} fieldName='lowerRights'/>
      <EditableCheckbox descr='Лишен родительских прав' initialBoolean={parentData.deprivedRights} access={edit} fieldName='deprivedRights'/>
      <EditableCheckbox descr='Проживает отдельно' initialBoolean={parentData.solitude} access={edit} fieldName='solitude'/>
      <EditableCheckbox descr='Судимость' initialBoolean={parentData.prison} access={edit} fieldName='prison'/>

      <PairLink descr='Карта семьи' link={`/family/view/${parentData.connected_family}`} text='Перейти' />
      {/*<PairLink descr='План индивидуальной профилактической работы (МПР семья)' link='' text='Перейти' />*/}



      

      {edit && <Button  type="primary" htmlType="submit">Сохранить изменения</Button>}
    </Form>}
    <h2>Правонарушения</h2>
    {parentData.isLoaded && parentData.crimes && <ParentTable access={access} data={parentData.crimes} guide={parentData._guideFields && parentData._guideFields.crimes.fromId} id={urlId} canDelete={parentData.canDelRows} />}

    
      


    <br/>
      <br/>
      <br/>
      {access && (parentData.archived != 2 ? <PairInputBtn onFinish={archiveHandler} fieldName='descr' descr='Запрос на архивацию карты' placeholder='Разъясните причину' submitText='Отправить запрос' /> : <Button onClick={unArchiveHandler}>Вернуть из архива</Button>)}
    </section>
  );
}

export default Parent;
