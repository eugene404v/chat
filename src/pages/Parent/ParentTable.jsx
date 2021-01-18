import React from "react";
import { EditableCell, EditableRowTrigger } from "components";
import axios from 'axios'
import moment from 'moment'
import {useSelector, useDispatch} from "react-redux"
import { fetchCrimeIds, fetchParent, refreshParent } from "redux/reducers/parentReducer";
import {Alert, Button} from 'antd'
import { DeleteOutlined, PlusSquareOutlined   } from "@ant-design/icons";
 

const EditableRow = (props) => {
  const [edit, setEdit] = React.useState(false)
  const [initiator, setInitiator] = React.useState(props.initiator.name)
  const [initiatorId, setInitiatorId] = React.useState(props.initiator.id)
  const [day, setDay] = React.useState(props.date)
  const [type, setType] = React.useState(props.type || props.type.name)
  const [crimeTypeId, setCrimeTypeId] = React.useState(props.type.id)
  const [article, setArticle] = React.useState(props.article && props.article.name)
  const [articleId, setArticleId] = React.useState(props.article && props.article.id)
  const [exists, setExists] = React.useState(true)
  const [descr, setDescr] = React.useState(props.descr)

  const [initiatorUrl, setInititatorUrl] = React.useState(0)
  const [initiatorsArray, setInitiatorsArray] = React.useState([])

  const [crimeTypesArray, setCrimeTypesArray] = React.useState([])
  const [crimeTypesUrl, setCrimeTypesUrl] = React.useState(0)

  const [crimeArticlesArray, setCrimeArticlesArray] = React.useState([])


  const dateHandler = (date, dateString) => {
    setDay(dateString)
  }

  const descrHandler = (e) => {
    setDescr(e.target.value)
  }

  const crimeTypeHandler = (val) => {
    setCrimeTypeId(val)
    setType(val)
  }

  const initiatorHandler = (val) => {
    setInitiatorId(val)
    setInitiator(initiatorsArray.find(el=> el.id == val).name)
  }

  const crimeArticlesHandler = (val) => {
    setArticleId(val)
    setArticle(crimeArticlesArray.find(el=> el.id == val).name)
  }

  const editHandler = async () => {
    let temporalInitUrl
    let temporalCrimesUrl
    await axios.get(`/guides/edit_item/${props.guide}/${props.id}`, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': "text/json"
      },
    })
    .then(function (response) {
      setEdit(true)
      temporalInitUrl = response.data.edit._guideFields.initiator.fromId
      temporalCrimesUrl = response.data.edit._guideFields.type.fromId
    })
    await setInititatorUrl(temporalInitUrl)
    await setCrimeTypesUrl(temporalCrimesUrl)
  }
  
  const cancelHandler = () => {
    setEdit(false)
  }

  const saveHandler = () => {
    const stateData = {
      date: day, article: articleId, type: crimeTypeId, initiator: initiatorId, descr
    }
    const formData = {}
    var formdata = new FormData();
    let key
    for (key in stateData){
        formdata.append(key, stateData[key])
    }
    axios.post(`/parents/crimesEdit/${props.parentId}/${props.id}`,formdata, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': "text/json"
      },
    })
    .then(function (response) {
      setEdit(false)
    })
  }

  const deleteHandler = (parentId) => {
    setExists(false)
    axios.post(`/parents/crimesDel/${parentId}/${props.id}`, {}, {headers: {
      Accept: "text/json"
    }})
  }

  const initiatorsSelectHandler = async () => {
    let temporalArr
    await axios.get(`/guides/list_items/${initiatorUrl}/0/0/0/0/1`, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': "text/json"
      },
    })
    .then(function (response) {
      temporalArr = response.data.data
    })
    await setInitiatorsArray(temporalArr)
    console.log(temporalArr)
  }

  const crimeTypesSelectHandler = async () => {
    let temporalArr
    await axios.get(`/guides/list_items/${crimeTypesUrl}?ignore_paging=1`, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': "text/json"
      },
    })
    .then(function (response) {
      temporalArr = response.data.data
    })
    await setCrimeTypesArray(temporalArr)
  }

  const crimeArticlesSelectHandler = async () => {
    let temporalArr
    await axios.get(`/guides/list_items/32?ignore_paging=1`, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': "text/json"
      },
    })
    .then(function (response) {
      temporalArr = response.data.data
    })
    await setCrimeArticlesArray(temporalArr)
  }

  return (
      exists && <tr>
        <EditableCell select="true" editing={edit} selectArray={initiatorsArray} onSelectFocus={initiatorsSelectHandler} onSelectChange={initiatorHandler} placeholder='Инициатор заполнения'>{initiator}</EditableCell>
        <EditableCell day="true" editing={edit} onDateChange={dateHandler}>{day}</EditableCell>
        <EditableCell select="true" editing={edit} selectArray={[{id:'Уголовное',name:'Уголовное'}, {id:'Административное',name:'Административное'}]} onSelectChange={crimeTypeHandler}>{type}</EditableCell>
        {type==='Административное' && <EditableCell select="true" editing={edit} selectArray={crimeArticlesArray} onSelectFocus={crimeArticlesSelectHandler} onSelectChange={crimeArticlesHandler}>{article}</EditableCell>}
        {type==='Уголовное' && <EditableCell input="true" editing={edit} onInputChange={descrHandler}>{descr}</EditableCell>}
        {props.access && <EditableRowTrigger editing={edit} onedit={editHandler} onCancel={cancelHandler} onSave={saveHandler}/>}
        {props.access && <td><Button onClick={()=>deleteHandler(props.parentId)}><DeleteOutlined /></Button></td>}
      </tr>
  );
};



function ParentTable(props) {
  const dispatch = useDispatch()
  const parentData = useSelector(state => state.parentReducer)
  const [adding, setAdding] = React.useState(false)

  const addHandler = () => {
    dispatch(fetchCrimeIds(parentData._guideFields.crimes.fromId))
    setAdding(true)
  }

const mappedRows = props.data && Array.isArray(props.data) && props.data.length>0 && props.data.map((el) => {
    return <EditableRow access={props.access} id={el.id} key={el.id} initiator={el.initiator} date={el.date} type={el.type} article={el.article} guide={el.guideId} canDelete={props.canDelete} parentId={parentData.id} descr={el.descr}/>
  })

const NewRow = (props) => {
  const [descr, setDescr] = React.useState()
  const [day, setDay] = React.useState()
  const [type, setType] = React.useState()
  const [crimeTypeId, setCrimeTypeId] = React.useState()
  const [intitiator, setInitiator] = React.useState()
  const [initiatorId, setInitiatorId] = React.useState()
  const [error, setError] = React.useState(false)
  const [article, setArticle] = React.useState()
  const [articleId, setArticleId] = React.useState()
  const [crimeArticlesArray, setCrimeArticlesArray] = React.useState([])

  const typeHandler = (val) => {
    setCrimeTypeId(val)
    setType(val)
  }

  const initiatorHandler = (val) => {
    setInitiatorId(val)
    setInitiator(parentData.initiatorsArr.find(el=> el.id == val).name)
  }

  const descrHandler = (e) => {
    setDescr(e.target.value)
  }

  const saveHandler = () => {
    const stateData = {
      date: day, article: articleId, type: crimeTypeId, initiator: initiatorId, descr
    }
    if ((!stateData.date)||(!stateData.type)||(!stateData.initiator)) {
      console.log(stateData)
      setError(true)
    } else {
      dispatch(refreshParent())
      const formData = {}
      var formdata = new FormData();
      let key
      for (key in stateData){
          formdata.append(key, stateData[key])
      }
      axios.post(`/parents/crimesAdd/${props.id}`,formdata, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': "text/json"
        },
      })
      .then(function (response) { 
        setAdding(false)
        dispatch(fetchParent(props.id))
      })
    }
    
  }

  const crimeArticlesSelectHandler = async () => {
    let temporalArr
    await axios.get(`/guides/list_items/32?ignore_paging=1`, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': "text/json"
      },
    })
    .then(function (response) {
      temporalArr = response.data.data
    })
    await setCrimeArticlesArray(temporalArr)
  }

  const cancelHandler = () => {
    setAdding(false)
  }

  const crimeArticlesHandler = (val) => {
    setArticleId(val)
    setArticle(parentData.crimeArticlesArr.find(el=> el.id == val).name)
  }

  return (
    <>
    <tr>
      <EditableCell select="true" editing={true} selectArray={parentData.initiatorsArr} onSelectChange={initiatorHandler} placeholder='Инициатор заполнения' >{intitiator}</EditableCell>
      <EditableCell day="true" editing={true} onDateChange={(_, dateStr) => {setDay(dateStr)}} placeholder='Введите дату'></EditableCell>
      <EditableCell select="true" editing={true} selectArray={[{id:'Уголовное',name:'Уголовное'}, {id:'Административное',name:'Административное'}]} onSelectChange={typeHandler} placeholder='Вид правонарушения'>{type}</EditableCell>
      {type==='Административное' && <EditableCell select="true" editing={true} selectArray={parentData.crimeArticlesArr} onSelectFocus={crimeArticlesSelectHandler} onSelectChange={crimeArticlesHandler}>{article}</EditableCell>}
        {type==='Уголовное' && <EditableCell input="true" editing={true} onInputChange={descrHandler}>{descr}</EditableCell>}
      <EditableRowTrigger editing={true} onCancel={cancelHandler} onSave={saveHandler}/>
    </tr>
    {error && <Alert message="Заполните поля" type="error" showIcon />}
    </>
);
}

  return (
<div>
  <table>
        <thead className="ant-table-thead">
          <tr>
            <th className="ant-table-cell">Инициатор заполнения</th>
            <th className="ant-table-cell">Дата</th>
            <th className="ant-table-cell">Вид</th>
            <th className="ant-table-cell">Статья, описание</th>
            <th className="ant-table-cell"></th>
            {props.access && <th className="ant-table-cell"></th>}
          </tr>
        </thead>
        <tbody className="ant-table-tbody">
          {mappedRows}
          {adding && <NewRow id={parentData.id}/>}
          
        </tbody>
    </table>    
      {!adding && <Button onClick={addHandler}><PlusSquareOutlined />Добавить</Button>}
</div>
  );
}

export default ParentTable;
