import React from "react";
import axios from 'axios'
import {Form, Button, Table, Input} from 'antd'
import moment from 'moment';
import {useParams} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {fetchChild, refreshChild, editChild, fetchSelects} from 'redux/reducers/childReducer'
import { EditOutlined, DownloadOutlined, PlusSquareOutlined } from "@ant-design/icons";

import {EditableText, EditableDate, EditableSelect, PairLink, Pair, EditableCheckbox, EditableCheckboxSelect, PairInputBtn, ErrorsList} from "components";
import ChildProfTable from './ChildProfTable'
import ChildWorkTable from "./ChildWorkTable";
import ChildEscapeTable from "./ChildEscapeTable";
import ChildIndividualTable from "./ChildIndividualTable";
import ChildCrimeTable from "./ChildCrimeTable";


function Child() {
  const [inst, setInst] = React.useState()
  const [access, setAccess] = React.useState(false)
  const urlId = useParams().id
const [edit, setEdit] = React.useState(false)
const dispatch = useDispatch()
const childData = useSelector(state => state.childReducer)
const userData = useSelector(state => state.userReducer)
const [creatingIpr, setCreatingIpr] = React.useState(false)
const [newTableName, setNewTableName] = React.useState()
const [distr, setDistr] = React.useState(childData.district && childData.district.id)
const [instArr, setInstArr] = React.useState()

React.useEffect(() => {
    dispatch(refreshChild())
    dispatch(fetchChild(urlId))
    if (userData.lvl==='admin' || userData.lvl === 'region'|| userData.lvl === 'master'|| userData.lvl === 'curator') {
      setAccess(true)
    }
}, [dispatch, urlId, userData.lvl])


const editHandler = () => {
  if (edit === false) {
    setEdit(true)
    childData._guideFields && dispatch(fetchSelects(childData._guideFields.institution.fromId, childData._guideFields.district.fromId, childData._guideFields.documentType.fromId, childData._guideFields.asylum.fromId))
  } else {
    setEdit(false)
  }
}

const newTableHandler = () => {
  setCreatingIpr(true)
}

const newTableNameHandler = (e) => {
  setNewTableName(e.target.value)
}

const createTableHandler = () => {
  const formdata = new FormData()
  formdata.append('name', newTableName)
  axios.post(`/children/addExtendedToChild/individual_main/${urlId}`, formdata, {
    headers: {
      Accept: 'text/json'
    }
  }).then(resp => {
    dispatch(refreshChild())
    dispatch(fetchChild(urlId))
    setCreatingIpr(false)
  })
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
  dispatch(editChild(values, urlId, inst))
  setEdit(false)
};

const onSelectHandler = (val) => {
  setInst(val)
}

const distrHandler =(val) => {
  setDistr(val)
}

const unArchiveHandler = () => {
  axios.post(`/archiving/returnFromArchive/children/${urlId}`, '', {headers: {Accept: 'text/json'}})
  .then(resp => alert(resp.data.info))
}

const instLoadHandler = () => {
  axios.get(`/institution/search?search_by=district&search=${distr}`, {
    headers: {
        Accept: 'text/json'
    }
      } ).then(resp=>setInstArr(resp.data.data))
}

  return (
    <section className="home">
      <h1>КАРТА РЕБЕНКА</h1> 
      {Array.isArray(childData._errors) && childData._errors.length>0 && <ErrorsList list={childData._errors}/>}
      {access && <Button onClick={editHandler}><EditOutlined/>Редактировать</Button>}
{childData.isLoaded && <Form  onFinish={onFinish} initialValues={{ 
      name: childData.name,
      last_name: childData.name && childData.name.split(' ')[0],
      first_name: childData.name && childData.name.split(' ')[1],
      middle_name: childData.name && childData.name.split(' ')[2],
      birthDate: childData.birthDate && moment(childData.birthDate),
      documentIssuedDate: childData.documentIssuedDate && (childData.documentIssuedDate !== '0000-00-00' ? moment(childData.documentIssuedDate) : ''),
      addressReg: childData.addressReg,
      addressFact: childData.addressFact,
      documentIssuedBy: childData.documentIssuedBy,
      
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
      <EditableText descr='Фамилия' text={childData.name && childData.name.split(' ')[0]} required={true} errMsg='Заполните поле' access={edit} fieldName='last_name'/>
      <EditableText descr='Имя' text={childData.name && childData.name.split(' ')[1]} required={true} errMsg='Заполните поле' access={edit} fieldName='first_name'/>
      <EditableText descr='Отчество' text={childData.name && childData.name.split(' ')[2]} required={true} errMsg='Заполните поле' access={edit} fieldName='middle_name'/>
      <EditableDate descr='Дата рождения' day={childData.birthDate && moment(childData.birthDate).format('DD.MM.YYYY').toString()} access={edit} fieldName='birthDate' required={true}/>

      <EditableSelect descr='Район' text={childData.district && childData.district.name} access={edit} selectArray={childData.districtsArr} fieldName='district' onSelect={distrHandler}/>
      <EditableSelect descr='Организация' text={childData.institution && childData.institution.name} access={edit} selectArray={instArr} fieldName='institution' disabled={!distr} onFocus={instLoadHandler}     />

      <EditableText descr='Адрес регистрации' text={childData.addressReg} access={edit} fieldName='addressReg'/>
      <EditableText descr='Адрес фактического проживания' text={childData.addressFact} access={edit} fieldName='addressFact'/>
      <EditableSelect descr='Тип документа' text={childData.documentType && childData.documentType.name} access={edit} selectArray={childData.docTypesArr} fieldName='documentType' />
      <EditableText descr='Документ выдан' text={childData.documentIssuedBy} access={edit} fieldName='documentIssuedBy'/>
      <EditableText descr='Номер и серия документа' text={childData.documentNumber} access={edit} fieldName='documentNumber'/>
      <EditableDate descr='Дата выдачи документа' day={moment(childData.documentIssuedDate).format('DD.MM.YYYY').toString()} access={edit} fieldName='documentIssuedDate'/>
      

      <EditableCheckbox descr='Ограниченные возможности здоровья' initialBoolean={childData.disability} access={edit} fieldName='disability'/>
      <EditableCheckbox descr='Инвалидность' initialBoolean={childData.invalid} access={edit} fieldName='invalid'/>
      <EditableCheckbox descr='Алкогольная зависимость' initialBoolean={childData.alcoholism} access={edit} fieldName='alcoholism'/>
      <EditableCheckbox descr='Табачная зависимость' initialBoolean={childData.smoking} access={edit} fieldName='smoking'/>
      <EditableCheckbox descr='Наркотическая зависимость' initialBoolean={childData.drugs} access={edit} fieldName='drugs'/>
      <EditableCheckbox descr='Иная зависимость' initialBoolean={childData.other} access={edit} fieldName='other'/>

      {edit && <EditableCheckboxSelect descr='Проживает в учреждении для детей-сирот и детей, оставшихся без попечения родителей' initialBoolean={childData.asylum && childData.asylum.id} access={edit} fieldName='asylum' selectArray={childData.asylumsArr} text={childData.asylum && childData.asylum.name} onSelectHandler={onSelectHandler}/>}
      {!edit &&childData.asylum&& <div class="editable"><div class="pair"><div class="pair__descr">Проживает в учреждении для детей-сирот и детей, оставшихся без попечения родителей</div><div class="pair__value">{childData.asylum && childData.asylum.name}</div></div></div>}

      {childData.connected_family && childData.connected_family !== '0' && <PairLink descr='Карта семьи' link={`/family/view/${childData.connected_family}`} text='Перейти' />}
      {/*<PairLink descr='План индивидуальной профилактической работы (МПР семья)' link='' text='Перейти' />*/}
      {edit && <Button  type="primary" htmlType="submit">Сохранить изменения</Button>}
    </Form>}
    <h2 className='subtitle'>Профилактический учет{(Array.isArray(childData.childProf) && childData.childProf.length>0) ? <a href={`/children/exportProfs/${urlId}`} download><Button type='primary'><DownloadOutlined /> Скачать</Button></a> : 
    <Button type='primary' onClick={() => alert('Отчет пуст')}><DownloadOutlined /> Скачать</Button>}</h2>
    
     <ChildProfTable data={childData.childProf} id={urlId} access={access}/> 
    <h2 className='subtitle'>Правонарушения</h2>
    <ChildCrimeTable data={childData.childCrimes} id={urlId} access={access}/>
    <h2 className='subtitle'>Занятость</h2>
    <ChildWorkTable data={childData.childWork} id={urlId} access={access}/>
    <h2 className='subtitle'>Ребенок выбыл</h2>
    <ChildEscapeTable data={childData.childEscape} id={urlId} access={access}/>


    <h2 className='subtitle'>План индивидуальной профилактической работы (ИПР ребенок){Array.isArray(childData.childIndividual) && childData.childIndividual.length>0 && <a href={`/children/exportPlans/${urlId}`} download><Button type='primary'><DownloadOutlined />Скачать</Button></a>}</h2>
    
    {Array.isArray(childData.childIndividual) && childData.childIndividual.map(el => {
      return <ChildIndividualTable data={el.items} id={urlId} access={access} name={el.name} tableId={el.id}/>
    })}
    {!creatingIpr && <Button type='primary' onClick={newTableHandler}><PlusSquareOutlined size='20px' />Добавить план ИПР</Button>}
    {creatingIpr && <div>
      <Input placeholder='Введите название' onChange={newTableNameHandler}/>
      <Button type='primary' onClick={createTableHandler}>Создать</Button>
      </div>}
    



      <br/>
      <br/>
      <br/>
    {access && (childData.archived != 2 ? <PairInputBtn onFinish={archiveHandler} fieldName='descr' descr='Запрос на архивацию карты' placeholder='Разъясните причину' submitText='Отправить запрос' /> : <Button onClick={unArchiveHandler}>Вернуть из архива</Button>)}

    
      
      
    </section>
  );
}

export default Child;
