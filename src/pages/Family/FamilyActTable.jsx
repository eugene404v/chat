import React from "react";
import { EditableCell, EditableRowTrigger } from "components";
import {useSelector, useDispatch} from 'react-redux'
import {refreshFamily, fetchFamily} from 'redux/reducers/familyReducer'
import {Alert, Upload, message, Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import axios from 'axios'


const EditableRow = (props) => {
  const famData = useSelector(state => state.familyReducer)
  const dispatch = useDispatch()
    const [edit, setEdit] = React.useState(false)
    const [dateViewed, setDateViewed] = React.useState(props.dateViewed)
    const [dateWrited, setDateWrited] = React.useState(props.dateWrited)
    const [source, setSource] = React.useState(props.source)
    const [addressFact, setAddressFact] = React.useState(props.addressFact)
    const [addressReg, setAddressReg] = React.useState(props.addressReg)
    const [exists, setExists] = React.useState(true)
    
    const dateViewedHandler = (_, dateString) => {
        setDateViewed(dateString)
    }

    const dateWritedHandler = (_, dateString) => {
        setDateWrited(dateString)
    }

    const sourceHandler = (e) => {
        setSource(e.target.value)
    }

    const addressFactHandler = (e) => {
        setAddressFact(e.target.value)
    }
  
    const addressRegHandler = (e) => {
        setAddressReg(e.target.value)
    }

    const editHandler = () => {
      //famData._guideFields && dispatch(fetchFamilyIndividualIds(famData._guideFields.familyIndividual.fromId))
      setEdit(true)
    }
    
    const cancelHandler = () => {
      setEdit(false)
    }
  
    const saveHandler = () => {
      const stateData = {
        dateViewed, dateWrited, source, addressFact, addressReg   
      }
      const formData = {}
    var formdata = new FormData();
    let key
    for (key in stateData){
        formdata.append(key, stateData[key])
    }
    axios.post(`/guides/edit_item/${props.guide}/${props.id}`,formdata, { //????????????????????????????????????????????????????????????????????????????
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
      axios.post(`/family/delExtendFromFamily/familyActs/${props.id}`, {}, {headers: { 
        Accept: "text/json"
      }})
    }
  
    return (
        exists && <tr index={props.id} display="table-row">
          <EditableCell day="true" editing={edit} onDateChange={dateWritedHandler}>{dateWrited}</EditableCell>
          <EditableCell input="true" editing={edit} onInputChange={sourceHandler}>{source}</EditableCell>
          <EditableCell day="true" editing={edit} onDateChange={dateViewedHandler}>{dateViewed}</EditableCell>
          <EditableCell input="true" editing={edit} onInputChange={addressRegHandler}>{addressReg}</EditableCell>
          <EditableCell input="true" editing={edit} onInputChange={addressFactHandler}>{addressFact}</EditableCell>
          <td><a href={`/files/download/${props.file}`} download>Скачать</a></td>
          <EditableRowTrigger editing={edit} onedit={editHandler} onCancel={cancelHandler} onSave={saveHandler}/>
          <td><button onClick={()=>deleteHandler(props.id)}>X</button></td>
        </tr>
    );
  };

function FamilyActTable(props) {
  const dispatch = useDispatch()
  const famData = useSelector(state => state.familyReducer)
  const [adding, setAdding] = React.useState(false)

  const addHandler = () => {
    //famData._guideFields && dispatch(fetchFamilyIndividualIds(famData._guideFields.familyIndividual.fromId))
      setAdding(true)
  }

  const NewRow = (props) => {
    const [error, setError] = React.useState(false)
    const [dateViewed, setDateViewed] = React.useState()
    const [dateWrited, setDateWrited] = React.useState()
    const [source, setSource] = React.useState()
    const [addressFact, setAddressFact] = React.useState()
    const [addressReg, setAddressReg] = React.useState()
    const [file, setFile] = React.useState()

    const dateViewedHandler = (_, dateString) => {
        setDateViewed(dateString)
    }

    const dateWritedHandler = (_, dateString) => {
        setDateWrited(dateString)
    }

  
    const sourceHandler = (e) => {
        setSource(e.target.value)
    }

    const addressFactHandler = (e) => {
        setAddressFact(e.target.value)
    }
  
    const addressRegHandler = (e) => {
        setAddressReg(e.target.value)
    }

    const fileHandler = (e) => {
      setFile(e.target.files[0])
    }
  
    const cancelHandler = () => {
      setAdding(false)
    }
  
    const saveHandler = () => {
        const stateData = {
            dateViewed, dateWrited, source, addressFact, addressReg, file   
        }
      if ((!stateData.dateViewed)||(!stateData.dateWrited)||(!stateData.source)||(!stateData.addressFact)||(!stateData.addressReg)||(!stateData.file)) {
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
        axios.post(`/family/addExtendedToFamily/familyActs/${props.id}`,formdata, { 
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
    <EditableCell day="true" editing={adding} onDateChange={dateWritedHandler} placeholder='Дата составления'>{dateWrited}</EditableCell>
          <EditableCell input="true" editing={adding} onInputChange={sourceHandler} placeholder='Источник информации'>{source}</EditableCell>
          <EditableCell day="true" editing={adding} onDateChange={dateViewedHandler} placeholder='Дата выявления'>{dateViewed}</EditableCell>
          <EditableCell input="true" editing={adding} onInputChange={addressRegHandler} placeholder='Адрес регистрации'>{addressReg}</EditableCell>
          <EditableCell input="true" editing={adding} onInputChange={addressFactHandler} placeholder='Адрес проживания'>{addressFact}</EditableCell>
          <td>
              <input type="file" onChange={fileHandler}/>
          </td>
      <EditableRowTrigger editing={true}  onCancel={cancelHandler} onSave={saveHandler}/>
    </tr>
    {error && <Alert message="Error" type="error" showIcon />}
    </>)
  }

    const mappedRows = Array.isArray(props.data) && props.data && props.data.map((el) => {
        return <EditableRow 
        id={el.id} 
        key={el.id} 
        dateViewed={el.dateViewed}
        dateWrited={el.dateWrited}
        source={el.source}
        addressFact={el.addressFact}
        addressReg={el.addressReg}
        guide={el.guideId}
        childId={props.id}
        file={el.file}
         />
    })

    return (
        <table>
        <thead className="ant-table-thead">
          <tr>
            <th className="ant-table-cell">Дата составления акта</th>  
            <th className="ant-table-cell">Источник поступления информации о семье</th>
            <th className="ant-table-cell">Дата выявления</th>
            <th className="ant-table-cell">Адрес регистрации</th>
            <th className="ant-table-cell">Адрес проживания</th>
            <th className="ant-table-cell">Акт</th>
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

export default FamilyActTable
