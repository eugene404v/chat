import React from "react";
import { EditableCell, EditableRowTrigger } from "components";
import {useSelector, useDispatch} from 'react-redux'
import {refreshChild, fetchChild, fetchIndividualsIds} from 'redux/reducers/childReducer'
import {Alert, Button, Input } from 'antd'
import axios from 'axios'
import { DownloadOutlined, DeleteOutlined, PlusSquareOutlined, EditOutlined, CheckCircleOutlined, CloseCircleOutlined   } from "@ant-design/icons";
import moment from 'moment'


const EditableRow = (props) => {
    const dispatch = useDispatch()
    const childData = useSelector(state => state.childReducer)
    const [edit, setEdit] = React.useState(false)
    const [day, setDay] = React.useState(props.date)
    const [name, setName] = React.useState(props.name)
    const [result, setResult] = React.useState(props.result)
    const [period, setPeriod] = React.useState(props.period)
    const [specialist, setSpecialist] = React.useState(props.specialist && (props.specialist.fio || props.specialist.name))
    const [specialistId, setSpecialistId] = React.useState(props.specialist && props.specialist.id)
    const [exists, setExists] = React.useState(true)
    const [arr, setArr] = React.useState()
    
    const dayHandler = (date, dateString) => {
      setDay(dateString)
    }
  
    const nameHandler = (e) => {
        setName(e.target.value)
    }
  
    const resultHandler = (e) => {
        setResult(e.target.value)
    }

    const periodHandler = (e) => {
        setPeriod(e.target.value)
    }

    const specialistHandler = (val) => {
      setSpecialistId(val)
      setSpecialist(arr.find(el=> el.id == val).fio)
    }
  
    const editHandler = () => {
      //childData._guideFields && dispatch(fetchIndividualsIds(childData._guideFields.childIndividual.fromId))
      axios.get(`/users/usersByInst/${(childData && childData.institution) ? childData.institution.id : ''}`,  {
        headers: {
          Accept: "text/json",
        },
      }).then(resp => setArr(resp.data.data))
      setEdit(true)
    }
    
    const cancelHandler = () => {
      setEdit(false)
    }
  
    const saveHandler = () => {
      const stateData = {
        date: day, name, result, period, specialist: specialistId
      }
      const formData = {}
        var formdata = new FormData();
        let key
        for (key in stateData){
            formdata.append(key, stateData[key])
        }
        axios.post(`/children/editExtendedInChild/individual/${props.id}/${props.childId}`,formdata, {
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
      axios.post(`/children/delExtendFromChild/individual/${props.id}/${props.childId}/${props.tableId}`, {}, {headers: {
        Accept: "text/json"
      }})
    }
  
    return (
        exists && <tr index={props.id} display="table-row">
          <EditableCell input="true" editing={edit} onInputChange={nameHandler}>{name}</EditableCell>
          <EditableCell input="true" editing={edit} onInputChange={resultHandler}>{result}</EditableCell>
          <EditableCell input="true" editing={edit} onInputChange={periodHandler}>{period}</EditableCell>
          <EditableCell select="true" editing={edit} selectArray={arr} onSelectChange={specialistHandler}>{specialist}</EditableCell>
          <EditableCell day="true" editing={edit} onDateChange={dayHandler}>{day}</EditableCell>
          {props.access && <EditableRowTrigger editing={edit} onedit={editHandler} onCancel={cancelHandler} onSave={saveHandler}/>}
          {props.access && <td><Button onClick={()=>deleteHandler(props.parentId)}><DeleteOutlined /></Button></td>}
        </tr>
    );
  };

function ChildIndividualTable(props) {
    const [existingTable, setExistingTable] = React.useState(true)
    const dispatch = useDispatch()
    const childData = useSelector(state => state.childReducer)
    const [adding, setAdding] = React.useState(false)
    const [arr, setArr] = React.useState()
    const [editName, setEditName] = React.useState(false)
    const [title, setTitle] = React.useState(props.name)

    const addHandler = () => {
      //childData._guideFields && dispatch(fetchIndividualsIds(childData._guideFields.childIndividual.fromId))
      axios.get(`/users/usersByInst/${childData && childData.institution && childData.institution.id}`,  {
        headers: {
          Accept: "text/json",
        },
      }).then(resp => setArr(resp.data.data))
        setAdding(true)
      }


      const titleEditHandler = () => {
        setEditName(true)
      }

      const titleInputHandler = (e) => {
        setTitle(e.target.value)
      }

      const cancelTitleHandler = () => {
        setEditName(false)
      }

      const saveTitleHandler = () => {
        let formdata = new FormData()
        formdata.append('name', title)
          axios.post(`/children/editExtendedInChild/individual_main/${props.tableId}/${props.id}`, formdata,{
            headers: {
              Accept: 'text/json'
            }
          }).then(resp => {
            dispatch(refreshChild())
          dispatch(fetchChild(props.id))
          setEditName(false)
          })
      }

      const deleteTableHandler = () => {
        setExistingTable(false)
        axios.post(`/children/delExtendFromChild/individial_main/${props.tableId}/${props.id}`, '',{
          headers: {
            Accept: 'text/json'
          }
        })
      }

      const NewRow = (props) => {
        const [error, setError] = React.useState(false)
        const [day, setDay] = React.useState()
        const [name, setName] = React.useState()
        const [result, setResult] = React.useState()
        const [period, setPeriod] = React.useState()
        const [specialist, setSpecialist] = React.useState()
        const [specialistId, setSpecialistId] = React.useState()
        
  
        
        const dayHandler = (date, dateString) => {
          setDay(dateString)
        }
      
        const nameHandler = (e) => {
            setName(e.target.value)
        }
      
        const resultHandler = (e) => {
            setResult(e.target.value)
        }
    
        const periodHandler = (e) => {
            setPeriod(e.target.value)
        }
    
        const specialistHandler = (val) => {
          setSpecialistId(val)
          setSpecialist(arr.find(el=> el.id == val).name)
        }
      
      const cancelHandler = () => {
        setAdding(false)
      }
      
        const saveHandler = () => {
          const stateData = {
            date: day, name, result, period, specialist: specialistId
          }
          if ((!stateData.name)||(!stateData.result)||(!stateData.period)||(!stateData.specialist)) {
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
            axios.post(`/children/addExtendedToChild/individual/${props.id}/${props.tableId}`,formdata, {
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
          <EditableCell input="true" editing={adding} onInputChange={nameHandler} placeholder='Наименование мероприятия'></EditableCell>
          <EditableCell input="true" editing={adding} onInputChange={resultHandler} placeholder='Ожидаемый результат'></EditableCell>
          <EditableCell input="true" editing={adding} onInputChange={periodHandler} placeholder='Период проведения'></EditableCell>
          <EditableCell select="true" editing={adding} selectArray={arr} onSelectChange={specialistHandler} placeholder='Ответственный'></EditableCell>
          <EditableCell day="true" editing={adding} onDateChange={dayHandler} placeholder='Дата проведения'></EditableCell>
          <EditableRowTrigger editing={true} onCancel={cancelHandler} onSave={saveHandler}/>
        </tr>
        {error && <Alert message="Заполните поля" type="error" showIcon />}
        </>)
      }
  

    const mappedRows =  props.data && (Array.isArray(props.data)===true) && props.data.map((el) => {
        return <EditableRow 
        id={el.id} 
        key={el.id} 
        date={el.date}
        name={el.name} 
        result={el.result}
        period={el.period}
        specialist={el.specialist}
        guide={el.guideId} 
        childId={props.id}
        access={props.access}
        tableId={props.tableId}
         />
    })

    return (
        existingTable && <><table>
        <thead className="ant-table-thead">
          <tr>
            {!editName && <th colSpan={4}><h2 style={{textAlign:'left'}}>{props.name}</h2></th>}
            {editName && <th colSpan={5}><Input defaultValue={props.name} className='' onChange={titleInputHandler}/></th> }
            {!editName && <th colSpan={2}><Button onClick={titleEditHandler}><EditOutlined/>Переименовать</Button></th>}
            {editName && <th colSpan={2} style={{display: 'flex'}}><Button onClick={saveTitleHandler}><CheckCircleOutlined/></Button><Button onClick={cancelTitleHandler}><CloseCircleOutlined/></Button></th> }
            {!editName && <th><Button onClick={deleteTableHandler}><DeleteOutlined /></Button></th>}
          </tr> 
          <tr>
            <th className="ant-table-cell">Наименование мероприятия</th>  
            <th className="ant-table-cell">Ожидаемый результат</th>
            <th className="ant-table-cell">Сроки проведения</th>
            <th className="ant-table-cell">Ответственный</th>
            <th className="ant-table-cell">Дата проведения мероприятия</th>
            <th className="ant-table-cell"></th>
            {props.access && <th className="ant-table-cell"></th>}
          </tr>
        </thead>
        <tbody className="ant-table-tbody">
          {mappedRows}
          {adding && <NewRow id={childData.id} tableId={props.tableId}/>}
          
        </tbody>
    </table>
        {!adding && <Button onClick={addHandler}><PlusSquareOutlined />Добавить строку</Button>}
        <br/><br/>
    </>
    )
}

export default ChildIndividualTable
