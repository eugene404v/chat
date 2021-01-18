import React from "react";
import {Form, Button, Input} from 'antd'
import moment from 'moment';
import {useParams} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {fetchFamily, refreshFamily, editFamily} from 'redux/reducers/familyReducer'
import axios from 'axios'

import {EditableText, EditableDate, EditableSelect, PairLink, Pair, EditableCheckbox, EditableCheckboxSelect, PairInputBtn, ErrorsList} from "components";
import FamilyMatesTable from "./FamilyMatesTable";
import FamilySopTable from "./FamilySopTable";
import FamilyMprTable from "./FamilyMprTable";
import FamilyIndividualTable from "./FamilyIndividualTable";
import FamilyForm from "./FamilyForm";
import FamilyActTable from "./FamilyActTable";
import { EditOutlined, DownloadOutlined, PlusSquareOutlined  } from "@ant-design/icons";


function Family() { // Главный компонент карты семьи
    const urlId = useParams().id
    const [edit, setEdit] = React.useState(false)
    const [access, setAccess] = React.useState(false)
    const dispatch = useDispatch()
    const familyData = useSelector(state => state.familyReducer)
    const userData = useSelector(state => state.userReducer)
    const [creatingIpr, setCreatingIpr] = React.useState(false)
const [newTableName, setNewTableName] = React.useState()

    React.useEffect(() => {
        dispatch(refreshFamily())
        dispatch(fetchFamily(urlId))
        if (userData.lvl==='admin' || userData.lvl === 'region'|| userData.lvl === 'master'|| userData.lvl === 'curator') { // проверка уровня доступа
          setAccess(true)
        }
    }, [dispatch, urlId, userData.lvl])
    
    const editHandler = () => {
      if (edit === false) {
        setEdit(true)
      } else {
        setEdit(false)
      }
    }

    const newTableHandler = () => { // создание новой таблицы МПР
      setCreatingIpr(true) 
    }
    
    const newTableNameHandler = (e) => { 
      setNewTableName(e.target.value)
    }
    
    const createTableHandler = () => { // сохранение новой таблицы
      const formdata = new FormData()
      formdata.append('name', newTableName)
      axios.post(`/family/addExtendedToFamily/familyIndividual_main/${urlId}`, formdata, {
        headers: {
          Accept: 'text/json'
        }
      }).then(resp => {
        dispatch(refreshFamily())
        dispatch(fetchFamily(urlId))
        setCreatingIpr(false)
      })
    }
    
    
    const archiveHandler = (data) => { // архивация карты
      var formdata = new FormData();
      let key;
      for (key in data) {
     
      formdata.append(key, data[key]);
    
  }
      axios.post(`/archiving/requestToArchive/37/${urlId}`, formdata,  {
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

      dispatch(editFamily(values, urlId, familyData.familyType))
      setEdit(false)
    };

    const unArchiveHandler = () => {
      axios.post(`/archiving/returnFromArchive/family/${urlId}`, '', {headers: {Accept: 'text/json'}})
      .then(resp => alert(resp.data.info))
    }

    return (
        <section>
            <h1>КАРТА СЕМЬИ</h1>
            {Array.isArray(familyData._errors) && familyData._errors.length>0 && <ErrorsList list={familyData._errors}/>}
            <h2 className='subtitle'>Совместно проживающие члены семьи</h2>
            <FamilyMatesTable data={familyData.familyMates} urlId={urlId} access={access} />
            <h2 className='subtitle'>Дополнительные сведения о семье</h2>
            {access && <Button onClick={editHandler}><EditOutlined/>Редактировать</Button>}
            {familyData.isLoaded && <FamilyForm onFinish={onFinish} data={familyData} access={edit} />}
            <h2 className='subtitle'>Сведения из БД СОП</h2>
            <FamilySopTable data={familyData.familySop} id={urlId} access={access} />
            <h2 className='subtitle'>Сведения об утверждении МПР</h2>
            <FamilyMprTable data={familyData.familyMpr} id={urlId} access={access} />
            <h2 className='subtitle'>Жилищно-бытовые условия проживания семьи</h2>
            <FamilyActTable data={familyData.familyActs}  id={urlId} access={access} />



            <h2 className='subtitle'>План индивидуальной профилактической работы (МПР семья){(Array.isArray(familyData.familyIndividual) && familyData.familyIndividual.length>0) ? <a href={`/family/exportPlans/${urlId}`} download><Button type='primary'><DownloadOutlined />Скачать</Button></a> : <Button type='primary' onClick={() => alert('Отчет пуст')}><DownloadOutlined />Скачать</Button>}</h2>
            
            {Array.isArray(familyData.familyIndividual) && familyData.familyIndividual.map(el => {
                  return <FamilyIndividualTable data={el.items} id={urlId} access={access} name={el.name} tableId={el.id}/>
            })}
            <br/>
            {!creatingIpr && <Button type='primary' onClick={newTableHandler}><PlusSquareOutlined size='20px' />Добавить план ИПР</Button>}
            {creatingIpr && <div>
                <Input placeholder='Введите название' onChange={newTableNameHandler}/>
                <Button type='primary' onClick={createTableHandler}>Создать</Button>
            </div>}





            <br/>
      <br/>
      <br/>
            {access && (familyData.archived != 2 ? <PairInputBtn onFinish={archiveHandler} fieldName='descr' descr='Запрос на архивацию карты' placeholder='Разъясните причину' submitText='Отправить запрос' /> : <Button onClick={unArchiveHandler}>Вернуть из архива</Button>)}
        </section>
    )
}

export default Family
