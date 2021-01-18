import React from "react";
import { EditableCell, EditableRowTrigger, AsyncSelect } from "components";
import {useSelector, useDispatch} from 'react-redux'
import {fetchFamilyIndividualIds, refreshFamily, fetchFamily} from 'redux/reducers/familyReducer'
import {Alert, Button, Input } from 'antd'
import axios from 'axios'
import { DownloadOutlined, DeleteOutlined, PlusSquareOutlined, EditOutlined, CheckCircleOutlined, CloseCircleOutlined   } from "@ant-design/icons";



const EditableRow = (props) => { // редактируемая строка таблицы
  const famData = useSelector(state => state.familyReducer)
  const dispatch = useDispatch()
    const [edit, setEdit] = React.useState(false)
    const [day, setDay] = React.useState(props.date)
    const [name, setName] = React.useState(props.name)
    const [result, setResult] = React.useState(props.result)
    const [period, setPeriod] = React.useState(props.period)
    const [specialist, setSpecialist] = React.useState( props.specialist && props.specialist.fio)
    const [specialistId, setSpecialistId] = React.useState( props.specialist && props.specialist.id)
    const [report, setReport] = React.useState(props.report)
    const [exists, setExists] = React.useState(true)
    
    const dayHandler = (_, dateString) => {
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
      setSpecialist(famData.familySpecsArr.find(el=> el.id == val).name)
    }
  
    const reportHandler = (e) => {
        setReport(e.target.value)

    }

    const editHandler = () => {
      famData._guideFields && dispatch(fetchFamilyIndividualIds(famData._guideFields.familyIndividual.fromId))
      setEdit(true)
    }
    
    const cancelHandler = () => {
      setEdit(false)
    }
  
    const saveHandler = () => {
      const stateData = {
        date: day, name, result, period, specialist: specialistId, report
      }
      const formData = {}
    var formdata = new FormData();
    let key
    for (key in stateData){
        formdata.append(key, stateData[key])
    }
    axios.post(`/family/editExtendedInFamily/familyIndividual/${props.id}/${props.childId}`,formdata, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': "text/json"
      },
    })
    .then(function (response) {
      setEdit(false)
    })
    }

    const onSelectHandler = (val) => {
      setSpecialistId(val)
      setSpecialist(val)
    }
  
    const deleteHandler = (id) => {
      setExists(false)
      axios.post(`/family/delExtendFromFamily/familyIndividual/${props.id}/${props.childId}/${props.tableId}`, {}, {headers: { //${props.id}/${props.childId}
        Accept: "text/json"
      }})
    }
  
    return (
        exists && <><tr index={props.id} display="table-row">
          <EditableCell input="true" editing={edit} onInputChange={nameHandler}>{name}</EditableCell>
          <EditableCell input="true" editing={edit} onInputChange={resultHandler}>{result}</EditableCell>
          <EditableCell input="true" editing={edit} onInputChange={periodHandler}>{period}</EditableCell>
          {edit && <td><AsyncSelect type='users' onSelectChange={specialistHandler} onSelectHandler={onSelectHandler}/></td>}
          {!edit && <td>{specialist}</td>}
          <EditableCell day="true" editing={edit} onDateChange={dayHandler}>{day}</EditableCell>
          {props.access && <EditableRowTrigger editing={edit} onedit={editHandler} onCancel={cancelHandler} onSave={saveHandler}/>}
          {props.access && <td><Button onClick={()=>deleteHandler(props.parentId)}><DeleteOutlined /></Button></td>}
        </tr>
        {edit &&<tr><td colSpan={6}><Input.TextArea placeholder='Текст отчета' onChange={reportHandler} defaultValue={report}></Input.TextArea></td></tr>}
        </>
    );
  };

function FamilyIndividualTable(props) { // компонент таблицы
  const dispatch = useDispatch()
  const famData = useSelector(state => state.familyReducer)
  const [adding, setAdding] = React.useState(false)
  const [editName, setEditName] = React.useState(false)
    const [title, setTitle] = React.useState(props.name)
    const [existingTable, setExistingTable] = React.useState(true)

  const addHandler = () => {
    famData._guideFields && dispatch(fetchFamilyIndividualIds(famData._guideFields.familyIndividual.fromId))
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
      axios.post(`/family/editExtendedInFamily/familyIndividual_main/${props.tableId}/${props.id}`, formdata,{
        headers: {
          Accept: 'text/json'
        }
      }).then(resp => {
        dispatch(refreshFamily())
      dispatch(fetchFamily(props.id))
      })
  }

  const deleteTableHandler = () => {
    setExistingTable(false)
    axios.post(`/family/delExtendFromFamily/familyIndividual_main/${props.tableId}/${props.id}/`, '',{  ///family/delExtendFromFamily/familyIndividual/${props.id}/${props.childId}`
      headers: {
        Accept: 'text/json'
      }
    })
  }

  const NewRow = (props) => { // новая строка таблицы
    const [error, setError] = React.useState(false)
    const [day, setDay] = React.useState()
    const [name, setName] = React.useState()
    const [result, setResult] = React.useState()
    const [period, setPeriod] = React.useState()
    const [specialist, setSpecialist] = React.useState()
    const [specialistId, setSpecialistId] = React.useState()
    const [report, setReport] = React.useState()

    const dayHandler = (_, dateString) => {
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
      setSpecialist(val)
    }
  
    const reportHandler = (e) => {
        setReport(e.target.value)
    }
  
    const cancelHandler = () => {
      setAdding(false)
    }
  
    const saveHandler = () => {
      const stateData = {
        date: day, name, result, period, specialist: specialistId, report
      }
      if ((!stateData.name)||(!stateData.result)||(!stateData.period)||(!stateData.specialist)) {
        console.log(stateData)
        setError(true)
      } else {
        dispatch(refreshFamily())
        const formData = {}
        var formdata = new FormData();
        let key
        for (key in stateData){
            formdata.append(key, stateData[key])
        }
        axios.post(`/family/addExtendedToFamily/familyIndividual/${props.id}/${props.tableId}`,formdata, { 
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': "text/json"
          },
        })
        .then(function (response) { 
          setAdding(false)
          dispatch(fetchFamily(props.id))
        })
      }
    }

    const onSelectHandler = (val) => {
      setSpecialistId(val)
      setSpecialist(val)
    }

    return (<>
    <tr>
    <EditableCell input="true" editing={adding} onInputChange={nameHandler} placeholder='Наименование'></EditableCell>
          <EditableCell input="true" editing={adding} onInputChange={resultHandler} placeholder='Ожидаемый результат'></EditableCell>
          <EditableCell input="true" editing={adding} onInputChange={periodHandler} placeholder='Сроки проведения'></EditableCell>
          <td><AsyncSelect type='users' onSelectChange={specialistHandler} onSelectHandler={onSelectHandler}/></td>
          <EditableCell day="true" editing={adding} onDateChange={dayHandler} placeholder='Дата проведения'></EditableCell>
      <EditableRowTrigger editing={true}  onCancel={cancelHandler} onSave={saveHandler}/>
    </tr>
    {adding &&<tr><td colSpan={6}><Input.TextArea placeholder='Текст отчета' onChange={reportHandler} style={{minHeight: '100px'}}></Input.TextArea></td></tr>}
    {error && <Alert message="Заполните поля" type="error" showIcon />}
    </>)
  }

    const mappedRows = Array.isArray(props.data) && props.data.map((el) => {
        return <EditableRow 
        id={el.id} 
        key={el.id} 
        date={el.date}
        name={el.name} 
        result={el.result}
        period={el.period}
        specialist={el.specialist}
        report={el.report}
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
            {!editName && <th colSpan={4}><h2 style={{textAlign: 'left'}}>{props.name}</h2></th>}
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
          {adding && <NewRow id={famData.id} tableId={props.tableId}/>}
          
        </tbody>
    </table>
    {!adding && <Button onClick={addHandler}><PlusSquareOutlined />Добавить</Button>}
    <br/>
    <br/>
    </>
    )
}

export default FamilyIndividualTable
