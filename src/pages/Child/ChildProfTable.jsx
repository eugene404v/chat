import React from "react";
import { EditableCell, EditableRowTrigger } from "components";
import {useSelector, useDispatch} from 'react-redux'
import {fetchProfIds, refreshChild, fetchChild} from 'redux/reducers/childReducer'
import {Alert } from 'antd'
import axios from 'axios'

const EditableRow = (props) => {
  const childData = useSelector(state => state.childReducer)
  const dispatch = useDispatch()
  const [edit, setEdit] = React.useState(false)
  const [type, setType] = React.useState(props.type.name)
  const [typeId, setTypeId] = React.useState(props.type.id)
  const [status, setStatus] = React.useState(props.status.name)
  const [statusId, setStatusId] = React.useState(props.status.id)
  const [dayStart, setDayStart] = React.useState(props.dateStart)
  const [dayEnd, setDayEnd] = React.useState(props.dateEnd)
  const [reasonStart, setReasonStart] = React.useState(props.reasonStart.name)
  const [reasonStartId, setReasonStartId] = React.useState(props.reasonStart.id)
  const [reasonEnd, setReasonEnd] = React.useState(props.reasonEnd.name)
  const [reasonEndId, setReasonEndId] = React.useState(props.reasonEnd.id)

  const [exists, setExists] = React.useState(true)

  const typeHandler = (val) => {
    setTypeId(val)
    setType(childData.typesArr.find(el=> el.id == val).name)
  }

  const statusHandler = (val) => {
    setStatusId(val)
    setStatus(childData.statusArr.find(el=> el.id == val).name)
  }

  const dayStartHandler = (_, dateString) => {
    setDayStart(dateString)
  }

  const dayEndHandler = (_, dateString) => {
    setDayEnd(dateString)
  }

  const reasonStartHandler = (val) => {
    setReasonStartId(val)
    setReasonStart(childData.reasonStartArr.find(el=> el.id == val).name)
  }

  const reasonEndHandler = (val) => {
    setReasonEndId(val)
    setReasonEnd(childData.reasonEndArr.find(el=> el.id == val).name)
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
      type: typeId, status: statusId, dateStart: dayStart, dateEnd: dayEnd, reasonStart: reasonStartId, reasonEnd: reasonEndId
    }
    const formData = {}
    var formdata = new FormData();
    let key
    for (key in stateData){
        formdata.append(key, stateData[key])
    }
    axios.post(`/guides/edit_item/${props.guide}/${props.id}`,formdata, {
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

  return (
      exists && <tr index={props.id}>
        <EditableCell select="true" editing={edit} selectArray={childData.typesArr} onSelectChange={typeHandler}>{type}</EditableCell>
        <EditableCell select="true" editing={edit} selectArray={childData.statusArr} onSelectChange={statusHandler}>{status}</EditableCell>
        <EditableCell day="true" editing={edit} onDateChange={dayStartHandler}>{dayStart}</EditableCell>
        <EditableCell day="true" editing={edit} onDateChange={dayEndHandler}>{dayEnd}</EditableCell>
        <EditableCell select="true" editing={edit} selectArray={childData.reasonStartArr} onSelectChange={reasonStartHandler}>{reasonStart}</EditableCell>
        <EditableCell select="true" editing={edit} selectArray={childData.reasonEndArr} onSelectChange={reasonEndHandler}>{reasonEnd}</EditableCell>
        <EditableRowTrigger editing={edit} onedit={editHandler} onCancel={cancelHandler} onSave={saveHandler}/>
        <td><button onClick={()=>deleteHandler(props.childId)}>X</button></td>
      </tr>
  );
};


function ChildProfTable(props) {
  const dispatch = useDispatch()
  const childData = useSelector(state => state.childReducer)
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
    const [dayStart, setDayStart] = React.useState()
    const [dayEnd, setDayEnd] = React.useState()
    const [reasonStart, setReasonStart] = React.useState()
    const [reasonStartId, setReasonStartId] = React.useState()
    const [reasonEnd, setReasonEnd] = React.useState()
    const [reasonEndId, setReasonEndId] = React.useState()

    
  
    const typeHandler = (val) => {
      setTypeId(val)
      setType(childData.typesArr.find(el=> el.id == val).name)
    }
  
    const statusHandler = (val) => {
      setStatusId(val)
      setStatus(childData.statusArr.find(el=> el.id == val).name)
    }
  
    const dayStartHandler = (_, dateString) => {
      setDayStart(dateString)
    }
  
    const dayEndHandler = (_, dateString) => {
      setDayEnd(dateString)
    }
  
    const reasonStartHandler = (val) => {
      setReasonStartId(val)
      setReasonStart(childData.reasonStartArr.find(el=> el.id == val).name)
    }
  
    const reasonEndHandler = (val) => {
      setReasonEndId(val)
      setReasonEnd(childData.reasonEndArr.find(el=> el.id == val).name)
    }
  
    const cancelHandler = () => {
      setAdding(false)
    }
  
    const saveHandler = () => {
      const stateData = {
        type: typeId, status: statusId, dateStart: dayStart, dateEnd: dayEnd, reasonStart: reasonStartId, reasonEnd: reasonEndId
      }
      if ((!stateData.type)||(!stateData.status)||(!stateData.dateStart)||(!stateData.dateEnd)||(!stateData.reasonStart)||(!stateData.reasonEnd)) {
        console.log(stateData)
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

    return (<>
    <tr>
        <EditableCell select="true" editing={adding} onSelectChange={typeHandler} selectArray={childData.typesArr} placeholder='Выберите вид'></EditableCell>
        <EditableCell select="true" editing={adding} onSelectChange={statusHandler} selectArray={childData.statusArr} placeholder='Выберите статус'></EditableCell>
        <EditableCell day="true" editing={adding} onDateChange={dayStartHandler} placeholder='Укажите дату'></EditableCell>
        <EditableCell day="true" editing={adding} onDateChange={dayEndHandler} placeholder='Укажите дату'></EditableCell>
        <EditableCell select="true" editing={adding} onSelectChange={reasonStartHandler} selectArray={childData.reasonStartArr} placeholder='Выберите причину'></EditableCell>
        <EditableCell select="true" editing={adding} onSelectChange={reasonEndHandler}  selectArray={childData.reasonEndArr} placeholder='Выберите причину'></EditableCell>
        <EditableRowTrigger editing={true}  onCancel={cancelHandler} onSave={saveHandler}/>
    </tr>
    {error && <Alert message="Error" type="error" showIcon />}
    </>)
  }
    const mappedRows =  props.data && (Array.isArray(props.data)===true) && props.data.map((el) => {
        return <EditableRow 
        id={el.id} 
        key={el.id} 
        type={el.type} 
        status={el.status}
        dateStart={el.dateStart} 
        dateEnd={el.dateEnd} 
        reasonStart={el.reasonStart}
        reasonEnd={el.reasonEnd}  
        guide={el.guideId}
        childId={props.id}
         />
    })

    return (
        <table>
        <thead className="ant-table-thead">
          <tr>
            <th className="ant-table-cell">Вид</th>
            <th className="ant-table-cell">Статус</th>
            <th className="ant-table-cell">Дата постановки</th>
            <th className="ant-table-cell">Дата снятия</th>
            <th className="ant-table-cell">Причина постановки</th>
            <th className="ant-table-cell">Причина снятия</th>
            <th className="ant-table-cell"></th>
          </tr>
        </thead>
        <tbody className="ant-table-tbody">
          {mappedRows}
          {adding && <NewRow id={childData.id}/>}
          {!adding && <button onClick={addHandler}>ADD NEW</button>}
        </tbody>
    </table>
    )
}

export default ChildProfTable
