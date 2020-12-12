import React from 'react'
import { AsyncSelect, EditableCell, EditableRowTrigger, PairLink } from "components";
import {Link} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import { refreshFamily, fetchFamily, setFamilyMate} from 'redux/reducers/familyReducer'
import {Alert } from 'antd'
import axios from 'axios'


const EditableRow = (props) => {
    const [edit, setEdit] = React.useState(false)
    const [day, setDay] = React.useState(props.date)
    const [name, setName] = React.useState(props.name)
    const [ties, setTies] = React.useState(props.ties)
    const [work, setWork] = React.useState(props.work)
    const [exists, setExists] = React.useState(true)
    
    const dayHandler = (date, dateString) => {
      setDay(dateString)
    }
  
    const nameHandler = (e) => {
        setName(e.target.value)
    }
  
    const tiesHandler = (e) => {
        setTies(e.target.value)
    }

    const workHandler = (e) => {
        setWork(e.target.value)
    }
  
    const editHandler = () => {
      setEdit(true)
    }
    
    const cancelHandler = () => {
      setEdit(false)
    }
  
    const saveHandler = () => {
      const stateData = {
        day, name, ties, work, id: props.id
      }
      alert(JSON.stringify(stateData))
    }
  
    const deleteHandler = (id) => {
      setExists(false)
      axios.post(`/family/removeMember/${props.urlId}/${props.type}/${id}`, {}, {headers: { 
        Accept: "text/json"
      }})
    }
  
    return (
        exists && <tr>
          <td>{props.index + 1}</td>
          <EditableCell input="true" editing={false} onInputChange={tiesHandler}>{ties}</EditableCell>
          <EditableCell select="true" editing={false} onSelectChange={nameHandler}>{name}</EditableCell>
          <td><Link to={props.link}>Перейти в карту</Link></td>
          <EditableCell day="true" editing={false} onDateChange={dayHandler}>{day}</EditableCell>
          <EditableCell input="true" editing={false} onInputChange={workHandler} maxLength={120} >{work}</EditableCell>


          <td><button onClick={()=>deleteHandler(props.id)}>X</button></td>
        </tr>
    );
  };

function FamilyMatesTable(props) {
  const dispatch = useDispatch()
  const famData = useSelector(state => state.familyReducer)
  const [adding, setAdding] = React.useState(false)
  
  

  const addHandler = () => {
      setAdding(true)
  }

  const NewRow = (props) => {
    const [error, setError] = React.useState(false)
    const [ties, setTies] = React.useState()
    const [tiesId, setTiesId] = React.useState(0)
    const [name, setName] = React.useState()
    const [birthDate, setBirthDate] = React.useState()
    const [work, setWork] =  React.useState()
    const [nameId, setNameId] = React.useState()
    const [linkTo, setLinkTo] = React.useState()
    const [mate, setMate] = React.useState()
    const [id, setId] = React.useState()

    const tiesHandler = (val) => {
      setTiesId(val)
      setTies([{id: 1, name: 'Ребенок'}, {id:2, name:'Родитель'}].find(el=> el.id == val).name)

    }
    const nameHandler = (val) => {

    }
  
    const cancelHandler = () => {
      setAdding(false)
    }
  
    const saveHandler = () => {
      let link 
      tiesId===1?link=`child`:link=`parent`
      axios.post(`/family/appendMember/${props.urlId}/${link}/${id}`, {}, {headers: { 
        Accept: "text/json"
      }})

    }

    const onSelectHandler = (value) => {
      let link 
      tiesId===1?link=`/children/view/${value}`:link=`/parents/view/${value}`
      axios
    .get(link, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
        setName(response.data.source.name)
        setBirthDate(response.data.source.birthDate)
        let work
        (tiesId===1)?work=response.data.source.institution.name:work=response.data.source.work
        setWork(work)
        setLinkTo(response.data.source.id)
        setId(response.data.source.id)
    });
    }

    return (<>
      <tr>
        <td>{famData.familyMates.length + 1}</td>
        <EditableCell select="true" editing={true} onSelectChange={tiesHandler} selectArray={[{id: 1, name: 'Ребенок'}, {id:2, name:'Родитель'}]} >{ties}</EditableCell>
        <td><AsyncSelect disabled={!tiesId} type={(tiesId==1)?`children`:`parents`} onSelectChange={nameHandler} onSelectHandler={onSelectHandler}/></td>
        <td>{!!tiesId && !!linkTo && <Link to={(tiesId==1)?`/children/view/${linkTo}`:`/parents/view/${linkTo}`}>Перейти в карту</Link>}</td>
        <EditableCell day="true" editing={false}>{birthDate}</EditableCell>
        <EditableCell input="true" editing={false} maxLength={120}>{work}</EditableCell>
        <EditableRowTrigger editing={true}  onCancel={cancelHandler} onSave={saveHandler}/>
      </tr>
      {error && <Alert message="Error" type="error" showIcon />}
      </>
  );}

    const mappedRows = props.data && props.data.map((el, i) => {
        return <EditableRow 
        index={i}
        id={el.id} 
        key={el.id*Math.random()} 
        name={el.name}
        date={el.birthDate}
        ties={(el.type==='parent')?'Законный представитель':'Ребенок'}
        work={(el.type==='parent')?el.work:(el.institution&&el.institution.name)}
        link={(el.type==='parent')?`/parents/view/${el.id}`:`/children/view/${el.id}`}
        type={el.type}
        urlId={props.urlId}
         />
    })

    return (
        <table>
        <thead className="ant-table-thead">
          <tr>
            <th className="ant-table-cell">№ п/п</th>
            <th className="ant-table-cell">Родственные отношения</th>  
            <th className="ant-table-cell">ФИО</th>
            <th className="ant-table-cell">Перейти в карту</th>
            <th className="ant-table-cell">Дата рождения</th>
            <th className="ant-table-cell">Место работы / место учебы</th>
            <th className="ant-table-cell"></th>
          </tr>
        </thead>
        <tbody className="ant-table-tbody">
          {mappedRows}
          {adding && <NewRow urlId={props.urlId}/>}
          {!adding && <button onClick={addHandler}>ADD NEW</button>}
        </tbody>
    </table>
    )

}
export default FamilyMatesTable
