import React from "react";
import { EditableCell, EditableRowTrigger } from "components";
import {useSelector, useDispatch} from 'react-redux'
import {fetchProfIds, refreshChild, fetchChild, fetchProfSelectLast} from 'redux/reducers/childReducer'
import {fetchProfSelectLastNew} from 'redux/reducers/childTempReducer'
import {Alert, Button } from 'antd'
import { DeleteOutlined, PlusSquareOutlined   } from "@ant-design/icons";
import axios from 'axios'

const EditableRow = (props) => {
  const childData = useSelector(state => state.childReducer)
  const dispatch = useDispatch()
  const [edit, setEdit] = React.useState(false)
  const [type, setType] = React.useState(props.type.name)
  const [typeId, setTypeId] = React.useState(props.type.id)
  const [status, setStatus] = React.useState(props.status)
  const [statusId, setStatusId] = React.useState(props.status.id)
  const [day, setDay] = React.useState(props.date)
  const [reason, setReason] = React.useState(props.reason && props.reason.name)
  const [reasonId, setReasonId] = React.useState(props.reason && props.reason.id)


  const [exists, setExists] = React.useState(true)

  const typeHandler = (val) => {
    setTypeId(val)
    setType(childData.typesArr.find(el=> el.id == val).name)
  }

  const statusHandler = (val) => {
    setStatusId(val)
    setStatus(childData.statusArr.find(el=> el.id == val).name)
  }

  const dayHandler = (_, dateString) => {
    setDay(dateString)
  }


  const reasonHandler = (val) => {
    setReasonId(val)
    setReason(childData.reasonArr.find(el=> el.id == val).name)
  }

  const editHandler = () => {
    childData._guideFields && dispatch(fetchProfIds(childData._guideFields.childProf.fromId))
    setEdit(true)
  }
  
  const cancelHandler = () => {
    setEdit(false)
  }

  const saveHandler = () => {
    const stateData = {
      type: typeId, status: statusId, date: day, reason: reasonId
    }
    const formData = {}
    var formdata = new FormData();
    let key
    for (key in stateData){
        formdata.append(key, stateData[key])
    }
    axios.post(`/children/editExtendedInChild/profs/${props.id}/${props.childId}`,formdata, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': "text/json"
      },
    })
    .then(function (response) {
      setEdit(false)
    })
  }

  const deleteHandler = (childId) => {
    setExists(false)
    axios.post(`/children/delExtendFromChild/profs/${props.id}/${childId}`, {}, {headers: {
      Accept: "text/json"
    }})
  }

  const loadReasonsHandler = () => {
    dispatch(fetchProfSelectLast(status, typeId))
  }

  return (
      exists && <tr index={props.id}>
        <EditableCell select="true" editing={edit} selectArray={childData.typesArr} onSelectChange={typeHandler}>{type}</EditableCell>
        <EditableCell select="true" editing={edit} selectArray={childData.statusArr}   onSelectChange={statusHandler}>{status}</EditableCell>
        <EditableCell day="true" editing={edit} onDateChange={dayHandler}>{day}</EditableCell>
        <EditableCell select="true" editing={edit} selectArray={childData.reasonArr} onSelectFocus={loadReasonsHandler} onSelectChange={reasonHandler}>{reason}</EditableCell>
        {props.access && <EditableRowTrigger editing={edit} onedit={editHandler} onCancel={cancelHandler} onSave={saveHandler}/>}
        {props.access && <td><Button onClick={()=>deleteHandler(props.parentId)}><DeleteOutlined /></Button></td>}
      </tr>
  );
};


function ChildProfTable(props) {
  const dispatch = useDispatch()
  const childData = useSelector(state => state.childReducer)
  const childTempData  = useSelector(state => state.childTempReducer)
  const [adding, setAdding] = React.useState(false)

  const addHandler = () => {
    childData._guideFields && dispatch(fetchProfIds(childData._guideFields.childProf.fromId))
      setAdding(true)
    }

  const NewRow = (props) => {
    const [error, setError] = React.useState(false)
    const [type, setType] = React.useState()
    const [typeId, setTypeId] = React.useState()
    const [status, setStatus] = React.useState()
    const [statusId, setStatusId] = React.useState()
    const [day, setDay] = React.useState()
    const [reason, setReason] = React.useState()
    const [reasonId, setReasonId] = React.useState()
    const [reasons, setReasons] = React.useState([])
    const [reasonStart, setReasonStart] = React.useState([])


    
  
    const typeHandler = (val) => {
      setTypeId(val)
      setType(childData.typesArr.find(el=> el.id == val).name)
      // dispatch(fetchProfSelectLastNew(status, typeId))
    }
  
    const statusHandler = (val) => {
      setStatusId(val)
      setStatus(childData.statusArr.find(el=> el.id == val).name)
      
    }

  
    const dayHandler = (_, dateString) => {
      setDay(dateString)
    }

  
    const reasonHandler = (val) => {
      setReasonId(val)
      setReasonStart(reasons.find(el=> el.id == val).name)
      setReason(reasons.find(el=> el.id == val).name)
    }
  

    const cancelHandler = () => {
      setAdding(false)
      
    }
  
    const saveHandler = () => {
      const stateData = {
        type: typeId, status: statusId, date: day,  reason: reasonId
      }
      if ((!stateData.type)||(!stateData.status)||(!stateData.date)||(!stateData.reason)) {
        setError(true)
      } else {
        dispatch(refreshChild())
        const formData = {}
        var formdata = new FormData();
        let key
        for (key in stateData){
            formdata.append(key, stateData[key])
        }
        axios.post(`/children/addExtendedToChild/profs/${props.id}`,formdata, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': "text/json"
          },
        })
        .then(function (response) { 
          setAdding(false)
          dispatch(fetchChild(props.id))
        })
      }
    }
    const loadReasonsHandler = () => {
      const start = status === 'Поставлен' ? 0 : 1;
      axios.get(`/children/loadSelect/prof?forEnd=${start}&profType=${typeId}`, {
        headers: {
          Accept: "text/json",
        },
      })
      .then(response => setReasons([...response.data.data]))
    }
// disabled={!typeId}
    return (<>
    <tr>
        <EditableCell select="true" editing={adding} onSelectChange={typeHandler} selectArray={childData.typesArr} placeholder='Выберите вид'></EditableCell>
        <EditableCell select="true" editing={adding} onSelectChange={statusHandler} selectArray={childData.statusArr} placeholder='Выберите статус'></EditableCell>
        <EditableCell day="true" editing={adding} onDateChange={dayHandler} placeholder='Укажите дату'></EditableCell>
        <EditableCell select="true" editing={adding} onSelectChange={reasonHandler} onSelectFocus={loadReasonsHandler} selectArray={reasons} placeholder='Выберите причину' disabled={!status || !typeId}></EditableCell>
        <EditableRowTrigger editing={true}  onCancel={cancelHandler} onSave={saveHandler}/>
    </tr>
    {error && <Alert message="Заполните поля" type="error" showIcon />} 
    </>)
  }
  const mappedRows =  Array.isArray(props.data) && props.data.map((el) => {
    return <EditableRow 
    id={el.id} 
    key={el.id} 
    type={el.type} 
    status={el.status}
    date={el.date} 
    reason={el.reason}
    guide={el.guideId}
    childId={props.id}
    access={props.access}
     />
})

    return (<>
        <table>
        <thead className="ant-table-thead">
          <tr>
            <th className="ant-table-cell">Вид</th>
            <th className="ant-table-cell">Статус</th>
            <th className="ant-table-cell">Дата постановки/снятия</th>
            <th className="ant-table-cell">Причина постановки/снятия</th>
            <th className="ant-table-cell"></th>
            {props.access && <th className="ant-table-cell"></th>}
          </tr>
        </thead>
        <tbody className="ant-table-tbody">
          {mappedRows}
          {adding && <NewRow id={childData.id}/>}
          
        </tbody>
    </table>
    {!adding && <Button onClick={addHandler}><PlusSquareOutlined />Добавить</Button>}
    </>)
}

export default ChildProfTable
