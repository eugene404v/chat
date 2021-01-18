import React from 'react'
import { AsyncSelect, EditableCell, EditableRowTrigger, PairLink } from "components";
import {Link, useParams} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import { refreshFamily, fetchFamily, setFamilyMate} from 'redux/reducers/familyReducer'
import {Alert, Button} from 'antd'
import axios from 'axios'
import { DeleteOutlined, PlusSquareOutlined   } from "@ant-design/icons";
import moment from 'moment'



const EditableRow = (props) => { // редактируемая строка таблицы
    const [edit, setEdit] = React.useState(false)
    const [day, setDay] = React.useState(props.date)
    const [name, setName] = React.useState(props.fio)
    const [ties, setTies] = React.useState(props.ties)
    const [relations, setRelations] = React.useState(props.relations)
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
    }
  
    const deleteHandler = (id) => {
      setExists(false)
      axios.post(`/family/removeMember/${props.urlId}/${props.memberId}`, {}, {headers: { 
        Accept: "text/json"
      }})
    }
  
    return (
        exists && <tr>
          <td>{props.index + 1}</td>
          <EditableCell input="true" editing={false} onInputChange={tiesHandler} style={{minWidth: '150px'}}>{relations}</EditableCell>
          <EditableCell select="true" editing={false} onSelectChange={nameHandler}>{name}</EditableCell>
          <td><Link to={props.link}>Перейти в карту</Link></td>
          <td style={{whiteSpace: 'nowrap'}}>{day && moment(day).format('DD-MM-YYYY').toString()}</td>
          <EditableCell input="true" editing={false} onInputChange={workHandler} maxLength={120} >{work}</EditableCell>
          {props.access && <td><Button onClick={()=>deleteHandler(props.parentId)}><DeleteOutlined /></Button></td>}
        </tr>
    );
  };

function FamilyMatesTable(props) { // компонент таблицы
  const urlId = useParams().id
  const dispatch = useDispatch()
  const famData = useSelector(state => state.familyReducer)
  const [adding, setAdding] = React.useState(false)
  
  

  const addHandler = () => {
      setAdding(true)
  }

  const NewRow = (props) => { // новая строка таблицы
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
    const [relationsArr, setRelationsArr] = React.useState()
    const [relations, setRelations] = React.useState()

    const tiesHandler = (val) => {
      setTiesId(val)
      setTies([{id: 1, name: 'Ребенок'}, {id:2, name:'Родитель'}].find(el=> el.id == val).name)
      if (val == 1) {
        setRelationsArr([{name:'Сын', id:'Сын' }, {name:'Дочь', id:'Дочь' }, {name:'Племянник', id:'Племянник' }, {name:'Брат', id:'Брат' }, {name:'Сестра', id:'Сестра' },  {name:'Иное', id:'Иное' }])
      } else {
        setRelationsArr([{name:'Мать', id:'Мать' }, {name:'Отец', id:'Отец' }, {name:'Опекун', id:'Опекун' }, {name:'Сожитель', id:'Сожитель' }, {name:'Бабушка', id:'Бабушка' }, {name:'Дедушка', id:'Дедушка' }, {name:'Дядя', id:'Дядя' }, {name:'Тетя', id:'Тетя' }, {name:'Иное', id:'Иное' }]) 
      }
    }
    const nameHandler = (val) => {

    }
  
    const cancelHandler = () => {
      setAdding(false)
    }
  
    const saveHandler = () => {
      let formdata = new FormData()
      formdata.append('relationship', relations)
      let link 
      tiesId===1?link=`child`:link=`parent`
      axios.post(`/family/appendMember/${props.urlId}/${link}/${id}`, formdata, {headers: { 
        Accept: "text/json"
      }}).then((response) => { 
        if (response.data.success === true) {
          dispatch(refreshFamily())
          dispatch(fetchFamily(urlId))
      } else {
        alert(response.data.info)
      }
        
      })

    }

    const relationsHandler = (val) => {
      setRelations(val)
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
        <EditableCell select="true" editing={true} onSelectChange={tiesHandler} selectArray={[{id: 1, name: 'Ребенок'}, {id:2, name:'Родитель'}]} placeholder='Семейные связи'>{ties}</EditableCell>
        <EditableCell disabled={!tiesId} select="true" editing={true} onSelectChange={relationsHandler} selectArray={relationsArr} placeholder='Родственные отношения'>{ties}</EditableCell>
        <td><AsyncSelect disabled={!tiesId} type={(tiesId==1)?`children`:`parents`} onSelectChange={nameHandler} onSelectHandler={onSelectHandler}/></td>
        <td>{!!tiesId && !!linkTo && <Link to={(tiesId==1)?`/children/view/${linkTo}`:`/parents/view/${linkTo}`}>Перейти в карту</Link>}</td>
        <EditableCell day="true" editing={false}>{birthDate}</EditableCell>
        <EditableCell input="true" editing={false} maxLength={120}>{work}</EditableCell>
        <EditableRowTrigger editing={true}  onCancel={cancelHandler} onSave={saveHandler}/>
      </tr>
      {error && <Alert message="Заполните поля" type="error" showIcon />}
      </>
  );}

    const mappedRows = props.data && props.data.map((el, i) => {
        return <EditableRow 
        index={i}
        id={el.childId || el.parentId}
        key={el.id*Math.random()} 
        fio={el.fio}
        date={el.birthDate}
        ties={(el.parent_member)?'Законный представитель':'Ребенок'}
        work={el.work}
        link={(el.parent_member)?`/parents/view/${el.parentId}`:`/children/view/${el.childId}`}
        type={(el.parent_member)?'parent':'child'}
        urlId={props.urlId}
        access={props.access}
        relations={el.relationship}
        memberId={el.id}
         />
    })

    return (<>
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
        </tbody>
    </table>
    {!adding && <Button onClick={addHandler}><PlusSquareOutlined />Добавить</Button>}
    </>
    )

}
export default FamilyMatesTable
