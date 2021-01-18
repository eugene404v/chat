import React from "react";
import { EditableCell, EditableRowTrigger } from "components";
import {useSelector, useDispatch} from 'react-redux'
import {fetchWorkIds, refreshChild, fetchChild} from 'redux/reducers/childReducer'
import {Alert, Button } from 'antd'
import { DeleteOutlined, PlusSquareOutlined   } from "@ant-design/icons";
import axios from 'axios'

const EditableRow = (props) => {
    const dispatch = useDispatch()
    const childData = useSelector(state => state.childReducer)
    const [edit, setEdit] = React.useState(false)
    const [type, setType] = React.useState(props.type || props.type.name)
    const [typeId, setTypeId] = React.useState(props.type || props.type.id)
    const [place, setPlace] = React.useState(props.place)
    const [dayStart, setDayStart] = React.useState(props.dateStart)
    const [dayEnd, setDayEnd] = React.useState(props.dateEnd)
    const [exists, setExists] = React.useState(true)
  
    const typeHandler = (val) => {
      setTypeId(val)
      setType(val)
    }
    
    const dayStartHandler = (date, dateString) => {
      setDayStart(dateString)
    }
  
    const dayEndHandler = (date, dateString) => {
      setDayEnd(dateString)
    }
  
    const placeHandler = (e) => {
      setPlace(e.target.value)
    }
  
    const editHandler = () => {
      childData._guideFields && dispatch(fetchWorkIds(childData._guideFields.childWork.fromId))
      setEdit(true)
    }
    
    const cancelHandler = () => {
      setEdit(false)
    }
  
    const saveHandler = () => {
      const stateData = {
        type: typeId, dateStart: dayStart, dateEnd: dayEnd, place
      }
      const formData = {}
        var formdata = new FormData();
        let key
        for (key in stateData){
            formdata.append(key, stateData[key])
        }
        axios.post(`/children/editExtendedInChild/works/${props.id}/${props.childId}`,formdata, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': "text/json"
          },
        })
        .then(function (response) {
          setEdit(false)
        })
    }
  
    const deleteHandler = (id) => {
      setExists(false)
      axios.post(`/children/delExtendFromChild/works/${props.id}/${props.childId}`, {}, {headers: {
        Accept: "text/json"
      }})
    }
    
    
    
    return (
        exists && <tr index={props.id} display="table-row">
          <EditableCell select="true" editing={edit} selectArray={[{id:'Трудоустройство', name:'Трудоустройство'},{id:'Дополнительное образование', name:'Дополнительное образование'},{id:'Общественное объединение', name:'Общественное объединение'}]}  onSelectChange={typeHandler}>{type}</EditableCell>
          <EditableCell day="true" editing={edit} onDateChange={dayStartHandler}>{dayStart}</EditableCell>
          <EditableCell day="true" editing={edit} onDateChange={dayEndHandler}>{dayEnd}</EditableCell>
          <EditableCell input="true" editing={edit} onInputChange={placeHandler} maxLength={180}>{place}</EditableCell>
          {props.access && <EditableRowTrigger editing={edit} onedit={editHandler} onCancel={cancelHandler} onSave={saveHandler}/>}
          {props.access && <td><Button onClick={()=>deleteHandler(props.parentId)}><DeleteOutlined /></Button></td>}
        </tr>
    );
  };

function ChildWorkTable(props) {
    const dispatch = useDispatch()
    const childData = useSelector(state => state.childReducer)
    const [adding, setAdding] = React.useState(false)

    const addHandler = () => {
    childData._guideFields && dispatch(fetchWorkIds(childData._guideFields.childWork.fromId))
      setAdding(true)
    }

    const NewRow = (props) => {
      const [error, setError] = React.useState(false)
      const [type, setType] = React.useState()
    const [typeId, setTypeId] = React.useState()
    const [place, setPlace] = React.useState()
    const [dayStart, setDayStart] = React.useState()
    const [dayEnd, setDayEnd] = React.useState()

      
    const typeHandler = (val) => {
      setTypeId(val)
      setType(val)
    }
    
    const dayStartHandler = (date, dateString) => {
      setDayStart(dateString)
    }
  
    const dayEndHandler = (date, dateString) => {
      setDayEnd(dateString)
    }
  
    const placeHandler = (e) => {
      setPlace(e.target.value)
    }
    
    const cancelHandler = () => {
      setAdding(false)
    }
    
      const saveHandler = () => {
        const stateData = {
          type: typeId, dateStart: dayStart, dateEnd: dayEnd, place
        }
        if ((!stateData.type)||(!stateData.dateStart)||(!stateData.dateEnd)||(!stateData.place)) {
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
          axios.post(`/children/addExtendedToChild/works/${props.id}`,formdata, {
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
      <EditableCell select="true" editing={adding} selectArray={[{id:'Трудоустройство', name:'Трудоустройство'},{id:'Дополнительное образование', name:'Дополнительное образование'},{id:'Общественное объединение', name:'Общественное объединение'}]}  placeholder='Вид работы' onSelectChange={typeHandler}></EditableCell>
          <EditableCell day="true" editing={adding} onDateChange={dayStartHandler}  placeholder='Начало работы'></EditableCell>
          <EditableCell day="true" editing={adding} onDateChange={dayEndHandler} placeholder='Конец работы'></EditableCell>
          <EditableCell input="true" editing={adding} onInputChange={placeHandler} maxLength={180} placeholder='Место работы'></EditableCell>
          <EditableRowTrigger editing={true} onCancel={cancelHandler} onSave={saveHandler}/>
      </tr>
      {error && <Alert message="Заполните поля" type="error" showIcon />}
      </>)
    }

    const mappedRows = props.data && (Array.isArray(props.data)===true) &&  props.data.map((el) => {
        return <EditableRow 
        id={el.id} 
        key={el.id} 
        type={el.type} 
        dateStart={el.dateStart} 
        dateEnd={el.dateEnd} 
        place={el.place}
        guide={el.guideId} 
        childId={childData.id}
        access={props.access}
         />
    })

    return (<>
        <table>
        <thead className="ant-table-thead">
          <tr>
            <th className="ant-table-cell">Вид</th>
            <th className="ant-table-cell">Дата начала</th>
            <th className="ant-table-cell">Дата окончания</th>
            <th className="ant-table-cell">Наименование учреждения, организующего занятость (должность, направление, секция)</th>
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

export default ChildWorkTable
