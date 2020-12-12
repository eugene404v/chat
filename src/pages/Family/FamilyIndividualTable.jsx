import React from "react";
import { EditableCell, EditableRowTrigger } from "components";
import {useSelector, useDispatch} from 'react-redux'
import {fetchFamilyIndividualIds, refreshFamily, fetchFamily} from 'redux/reducers/familyReducer'
import {Alert } from 'antd'
import axios from 'axios'


const EditableRow = (props) => {
  const famData = useSelector(state => state.familyReducer)
  const dispatch = useDispatch()
    const [edit, setEdit] = React.useState(false)
    const [day, setDay] = React.useState(props.date)
    const [name, setName] = React.useState(props.name)
    const [result, setResult] = React.useState(props.result)
    const [period, setPeriod] = React.useState(props.period)
    const [specialist, setSpecialist] = React.useState(props.specialist.fio)
    const [specialistId, setSpecialistId] = React.useState(props.specialist.id)
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
  
    const deleteHandler = (id) => {
      setExists(false)
      axios.post(`/family/delExtendFromFamily/familyIndividual/${props.id}`, {}, {headers: {
        Accept: "text/json"
      }})
    }
  
    return (
        exists && <tr index={props.id} display="table-row">
          <EditableCell input="true" editing={edit} onInputChange={nameHandler}>{name}</EditableCell>
          <EditableCell input="true" editing={edit} onInputChange={resultHandler}>{result}</EditableCell>
          <EditableCell input="true" editing={edit} onInputChange={periodHandler}>{period}</EditableCell>
          <EditableCell select="true" editing={edit} selectArray={famData.familySpecsArr} onSelectChange={specialistHandler}>{specialist}</EditableCell>
          <EditableCell day="true" editing={edit} onDateChange={dayHandler}>{day}</EditableCell>
          <EditableCell input="true" editing={edit} onInputChange={reportHandler}>{report}</EditableCell>
          <EditableRowTrigger editing={edit} onedit={editHandler} onCancel={cancelHandler} onSave={saveHandler}/>
          <td><button onClick={()=>deleteHandler(props.id)}>X</button></td>
        </tr>
    );
  };

function FamilyIndividualTable(props) {
  const dispatch = useDispatch()
  const famData = useSelector(state => state.familyReducer)
  const [adding, setAdding] = React.useState(false)

  const addHandler = () => {
    famData._guideFields && dispatch(fetchFamilyIndividualIds(famData._guideFields.familyIndividual.fromId))
      setAdding(true)
  }

  const NewRow = (props) => {
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
      setSpecialist(famData.familySpecsArr.find(el=> el.id == val).name)
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
      if ((!stateData.date)||(!stateData.name)||(!stateData.result)||(!stateData.period)||(!stateData.specialist)) {
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
        axios.post(`/family/addExtendedToFamily/familyIndividual/${props.id}`,formdata, { //?????????????????????????????????????????????????????????????????????
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

    return (<>
    <tr>
    <EditableCell input="true" editing={adding} onInputChange={nameHandler} placeholder='Наименование'></EditableCell>
          <EditableCell input="true" editing={adding} onInputChange={resultHandler} placeholder='Ожидаемый результат'></EditableCell>
          <EditableCell input="true" editing={adding} onInputChange={periodHandler} placeholder='Сроки проведения'></EditableCell>
          <EditableCell select="true" editing={adding} selectArray={famData.familySpecsArr} onSelectChange={specialistHandler} placeholder='Ответственный'></EditableCell>
          <EditableCell day="true" editing={adding} onDateChange={dayHandler} placeholder='Дата проведения'></EditableCell>
          <EditableCell input="true" editing={adding} onInputChange={reportHandler} placeholder='Отчет о проведенных мероприятиях'></EditableCell>
      <EditableRowTrigger editing={true}  onCancel={cancelHandler} onSave={saveHandler}/>
    </tr>
    {error && <Alert message="Error" type="error" showIcon />}
    </>)
  }

    const mappedRows = props.data.map((el) => {
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
         />
    })

    return (
        <table>
        <thead className="ant-table-thead">
          <tr>
            <th className="ant-table-cell">Наименование мероприятия</th>  
            <th className="ant-table-cell">Ожидаемый результат</th>
            <th className="ant-table-cell">Сроки проведения</th>
            <th className="ant-table-cell">Ответственный</th>
            <th className="ant-table-cell">Дата проведения мероприятия</th>
            <th className="ant-table-cell">Отчет</th>
            <th className="ant-table-cell"></th>
          </tr>
        </thead>
        <tbody className="ant-table-tbody">
          {mappedRows}
          {adding && <NewRow id={famData.id}/>}
          {!adding && <button onClick={addHandler}>ADD NEW</button>}
        </tbody>
    </table>
    )
}

export default FamilyIndividualTable
