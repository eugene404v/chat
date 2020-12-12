import React from "react";
import axios from 'axios'
import {Form, Button, Table} from 'antd'
import moment from 'moment';
import {useParams} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {fetchChild, refreshChild, editChild, fetchSelects} from 'redux/reducers/childReducer'

import {EditableText, EditableDate, EditableSelect, PairLink, Pair, EditableCheckbox, EditableCheckboxSelect, PairInputBtn} from "components";
import ChildProfTable from './ChildProfTable'
import ChildWorkTable from "./ChildWorkTable";
import ChildEscapeTable from "./ChildEscapeTable";
import ChildIndividualTable from "./ChildIndividualTable";
import ChildCrimeTable from "./ChildCrimeTable";


function Child() {
const urlId = useParams().id
const [access, setAccess] = React.useState(false)
const dispatch = useDispatch()
const childData = useSelector(state => state.childReducer)

React.useEffect(() => {
    dispatch(refreshChild())
    dispatch(fetchChild(urlId))
}, [dispatch, urlId])

const accessHandler = () => {
  if (access === false) {
    childData._guideFields && dispatch(fetchSelects(childData._guideFields.institution.fromId, childData._guideFields.district.fromId, childData._guideFields.documentType.fromId, childData._guideFields.asylum.fromId))
    setAccess(true)
  } else {
    setAccess(false)
  }
}

const archiveHandler = (data) => {
  var formdata = new FormData();
  let key;
  for (key in data) {
 
  formdata.append(key, data[key]);

}
  axios.post(`/archiving/requestToArchive/12/${urlId}`, formdata,  {
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
  dispatch(editChild(values, urlId))
};



  return (
    <section className="home">
      <h1>КАРТА РЕБЕНКА</h1> 

      <Button onClick={accessHandler}>EDIT</Button>
{childData.isLoaded && <Form  onFinish={onFinish} initialValues={{ 
      name: childData.name,
      birthDate: moment(childData.birthDate),
      addressReg: childData.addressReg,
      addressFact: childData.addressFact,
      documentIssuedBy: childData.documentIssuedBy,
      documentIssuedDate: childData.documentIssuedDate,
      documentNumber: childData.documentNumber,
      documentType: childData.documentType && childData.documentType.id,
      district: childData.district && childData.district.id,
      institution: childData.institution && childData.institution.id,
      
      disability: childData.disability,
      invalid: childData.invalid,
      alcoholism: childData.alcoholism,
      smoking: childData.smoking,
      drugs: childData.drugs,
      other: childData.other,
      asylum: childData.asylum && childData.asylum.id,
      asylumBoolean: childData.asylum && !!childData.asylum.id
      }} >
      <EditableText descr='ФИО' text={childData.name} access={access} fieldName='name'/>
      <EditableDate descr='Дата рождения' day={moment(childData.birthDate).format('YYYY.MM.DD').toString()} access={access} fieldName='birthDate'/>
      <EditableSelect descr='Организация' text={childData.institution && childData.institution.name} access={access} selectArray={childData.institutionsArr} fieldName='institution' />
      <EditableText descr='Адрес регистрации' text={childData.addressReg} access={access} fieldName='addressReg'/>
      <EditableText descr='Адрес фактического проживания' text={childData.addressFact} access={access} fieldName='addressFact'/>
      <EditableSelect descr='Тип документа' text={childData.documentType && childData.documentType.name} access={access} selectArray={childData.docTypesArr} fieldName='documentType' />
      <EditableText descr='Документ выдан' text={childData.documentIssuedBy} access={access} fieldName='documentIssuedBy'/>
      <EditableText descr='Номер и серия документа' text={childData.documentNumber} access={access} fieldName='documentNumber'/>
      <EditableDate descr='Дата выдачи документа' day={moment(childData.birthDate).format('YYYY.MM.DD').toString()} access={access} fieldName='birthDate'/>
      <EditableSelect descr='Район' text={childData.district && childData.district.name} access={access} selectArray={childData.districtsArr} fieldName='district' />

      <EditableCheckbox descr='Ограниченные возможности здоровья' initialBoolean={childData.disability} access={access} fieldName='disability'/>
      <EditableCheckbox descr='Инвалидность' initialBoolean={childData.invalid} access={access} fieldName='invalid'/>
      <EditableCheckbox descr='Алкогольная зависимость' initialBoolean={childData.alcoholism} access={access} fieldName='alcoholism'/>
      <EditableCheckbox descr='Табачная зависимость' initialBoolean={childData.smoking} access={access} fieldName='smoking'/>
      <EditableCheckbox descr='Наркотическая зависимость' initialBoolean={childData.drugs} access={access} fieldName='drugs'/>
      <EditableCheckbox descr='Иная зависимость' initialBoolean={childData.other} access={access} fieldName='other'/>

      <EditableCheckboxSelect descr='Проживает в учреждении для детей-сирот и детей, оставшихся без попечения родителей' initialBoolean={childData.asylum && childData.asylum.id} access={access} fieldName='asylum' selectArray={childData.asylumsArr} text={childData.asylum && childData.asylum.name}/>

      <PairLink descr='Карта семьи' link={`/family/view/${childData.connected_family}`} text='Перейти' />
      {/*<PairLink descr='План индивидуальной профилактической работы (МПР семья)' link='' text='Перейти' />*/}
      {access && <Button  type="primary" htmlType="submit">Сохранить изменения</Button>}
    </Form>}
    <h2>Профилактический учет</h2>
     <ChildProfTable data={childData.childProf} id={urlId}/> 
    <h2>Правонарушения</h2>
    <ChildCrimeTable data={childData.childCrimes} id={urlId}/>
    <h2>Занятость</h2>
    <ChildWorkTable data={childData.childWork} id={urlId}/>
    <h2>Ребенок выбыл</h2>
    <ChildEscapeTable data={childData.childEscape} id={urlId}/>
    <h2>План индивидуальной профилактической работы (ИПР ребенок)</h2>
    <ChildIndividualTable data={childData.childIndividual} id={urlId}/>
    <PairInputBtn onFinish={archiveHandler} fieldName='descr' descr='Запрос на архивацию карты' placeholder='Разъясните причину' submitText='Отправить запрос' />

    
      
      
    </section>
  );
}

export default Child;
