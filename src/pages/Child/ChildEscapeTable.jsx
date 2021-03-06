import React from "react";
import { EditableCell, EditableRowTrigger } from "components";
import {useSelector, useDispatch} from 'react-redux'
import {fetchEscapeIds, refreshChild, fetchChild} from 'redux/reducers/childReducer'
import {Alert, Button } from 'antd'
import axios from 'axios'
import { DeleteOutlined, PlusSquareOutlined   } from "@ant-design/icons";

const EditableRow = (props) => {
    const dispatch = useDispatch()
    const childData = useSelector(state => state.childReducer)
    const [edit, setEdit] = React.useState(false)
    const [day, setDay] = React.useState(props.date)
    
    const [orderNum, setOrderNum] = React.useState(props.orderNum)
    const [toDistr, setToDistr] = React.useState(props.toDistr && props.toDistr.name)
    const [toDistrId, setToDistrId] = React.useState(props.toDistr && props.toDistr.id)
    const [toInst, setToInst] = React.useState(props.toInst && props.toInst.name)
    const [toInstId, setToInstId] = React.useState(props.toInst && props.toInst.id)
    const [reason, setReason] = React.useState(props.reason && props.reason.name)
    const [reasonId, setReasonId] = React.useState(props.reason && props.reason.id)
    const [document, setDocument] = React.useState(props.document)
    const [exists, setExists] = React.useState(true)
    const [arr, setArr] = React.useState()

    const dayHandler = (_, dateString) => {
      setDay(dateString)
    }
  
    const orderNumHandler = (e) => {
        setOrderNum(e.target.value)
    }
  
    const toDistrHandler = (val) => {
      setToDistrId(val)
      setToDistr(childData.toDistrArr.find(el=> el.id == val).name)
    }

    const toInstHandler = (val) => {
      setToInstId(val)
      setToInst(arr.find(el=> el.id == val).name)
    }

    const reasonHandler = (val) => {
      setReasonId(val)
      setReason(childData.escapeReasonsArr.find(el=> el.id == val).name)
    }

    const documentHandler = (e) => {
        setDocument(e.target.value)
    }
  
    const editHandler = () => {
      childData._guideFields && dispatch(fetchEscapeIds(childData._guideFields.childEscape.fromId))
      setEdit(true)
    }
    
    const cancelHandler = () => {
      setEdit(false)
    }
  
    const saveHandler = () => {
      const stateData = {
        date: day, orderNum, toInst: toInstId, toDistr: toDistrId, reason: reasonId, document: document?document:'', fromDistr: props.fromDistr && props.fromDistr.id, fromInst: props.fromInst && props.fromInst.id
      }
      const formData = {}
        var formdata = new FormData();
        let key
        for (key in stateData){
            formdata.append(key, stateData[key])
        }
        axios.post(`/children/editExtendedInChild/escape/${props.id}/${props.childId}`,formdata, {
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
      axios.post(`/children/delExtendFromChild/escape/${props.id}/${props.childId}`, {}, {headers: {
        Accept: "text/json"
      }})
    }

    const focusHandler = () => {
      axios.get(`/institution/search?search_by=district&search=${toDistr}`,  {
        headers: {
          Accept: "text/json",
        },
      }).then(response => {
        setArr(response.data.data)
      })
    }
  
    return (
        exists && <tr index={props.id} display="table-row">
          <EditableCell day="true" editing={edit} onDateChange={dayHandler}>{day}</EditableCell>
          <EditableCell input="true" editing={edit} onInputChange={orderNumHandler}>{orderNum}</EditableCell>
          <td>{props.fromDistr && props.fromDistr.name}</td>
          <td>{props.fromInst && props.fromInst.name}</td>
          <EditableCell select="true" editing={edit} selectArray={childData.toDistrArr} onSelectChange={toDistrHandler}>{toDistr}</EditableCell>
          <EditableCell select="true" editing={edit}selectArray={arr} onSelectFocus={focusHandler} onSelectChange={toInstHandler}>{toInst}</EditableCell>
          <EditableCell select="true" editing={edit} selectArray={childData.escapeReasonsArr} onSelectChange={reasonHandler}>{reason}</EditableCell>
          <EditableCell disabled={reasonId!=1} input="true" editing={edit} onInputChange={documentHandler}>{document}</EditableCell>
          {props.access && <EditableRowTrigger editing={edit} onedit={editHandler} onCancel={cancelHandler} onSave={saveHandler}/>}
          {props.access && <td><Button onClick={()=>deleteHandler(props.parentId)}><DeleteOutlined /></Button></td>}
        </tr>
    );
  };


function ChildEscapeTable(props) {
    const dispatch = useDispatch()
    const childData = useSelector(state => state.childReducer)
    const [adding, setAdding] = React.useState(false)

    const addHandler = () => {
      childData._guideFields && dispatch(fetchEscapeIds(childData._guideFields.childEscape.fromId))
      setAdding(true)
    }

    const NewRow = (props) => {
      const [error, setError] = React.useState(false)
      const [day, setDay] = React.useState()
      const [orderNum, setOrderNum] = React.useState()
      const [toDistr, setToDistr] = React.useState()
      const [toDistrId, setToDistrId] = React.useState()
      const [toInst, setToInst] = React.useState()
      const [toInstId, setToInstId] = React.useState()
      const [reason, setReason] = React.useState()
      const [reasonId, setReasonId] = React.useState()
      const [document, setDocument] = React.useState()
      const [arr, setArr] = React.useState()
      const [fromDistr, setFromDistr] = React.useState(childData.district && childData.district.name)
      const [fromDistrId, setFromDistrId] = React.useState(childData.district && childData.district.id)
      const [fromInst, setFromInst] = React.useState(childData.institution && childData.institution.name)
      const [fromInstId, setFromInstId] = React.useState(childData.institution && childData.institution.id)

      const dayHandler = (_, dateString) => {
        setDay(dateString)
      }
    
      const orderNumHandler = (e) => {
          setOrderNum(e.target.value)
      }
    
      const toDistrHandler = (val) => {
        setToDistrId(val)
        setToDistr(childData.toDistrArr.find(el=> el.id == val).name)
      }
  
      const toInstHandler = (val) => {
        setToInstId(val)
        setToInst(arr.find(el=> el.id == val).name)
      }

      const focusHandler = () => {
        axios.get(`/institution/search?search_by=district&search=${toDistr}`,  {
          headers: {
            Accept: "text/json",
          },
        }).then(response => {
          setArr(response.data.data)
        })
      }
  
      const reasonHandler = (val) => {
        setReasonId(val)
        setReason(childData.escapeReasonsArr.find(el=> el.id == val).name)
      }
  
      const documentHandler = (e) => {
          setDocument(e.target.value)
      }
    
    
    const cancelHandler = () => {
      setAdding(false)
    }
    
      const saveHandler = () => {
        const stateData = {
          date: day, orderNum, toInst: toInstId, toDistr: toDistrId, reason: reasonId, document: document?document:'', fromDistr: fromDistrId, fromInst: fromInstId
        }
        if ((!stateData.date)||(!stateData.orderNum)||(!stateData.toInst)||(!stateData.toDistr)||(!stateData.reason)) {
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
          axios.post(`/children/addExtendedToChild/escape/${props.id}`,formdata, {
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
      <EditableCell day="true" editing={adding} onDateChange={dayHandler} placeholder='Дата выбытия'></EditableCell>
          <EditableCell input="true" editing={adding} onInputChange={orderNumHandler} placeholder='Номер приказа'></EditableCell>
          <td>{childData.district.name}</td>
          <td>{childData.institution.name}</td>
          <EditableCell select="true" editing={adding} selectArray={childData.toDistrArr} onSelectChange={toDistrHandler}  placeholder='Куда выбыл(район)'></EditableCell>
          <EditableCell select="true" editing={adding} selectArray={arr} onSelectFocus={focusHandler} onSelectChange={toInstHandler}  placeholder='Куда выбыл(ОО)' disabled={!toDistr}></EditableCell>
          <EditableCell select="true" editing={adding} selectArray={childData.escapeReasonsArr} onSelectChange={reasonHandler} placeholder='Основание'></EditableCell>
          <EditableCell disabled={reasonId!=1} input="true" editing={adding} onInputChange={documentHandler} placeholder='Документ об образовании'></EditableCell>
        <EditableRowTrigger editing={true} onCancel={cancelHandler} onSave={saveHandler}/>
      </tr>
      {error && <Alert message="Заполните поля" type="error" showIcon />}
      </>)
    }

    const mappedRows = props.data && (Array.isArray(props.data)===true) && props.data.map((el) => {
        return <EditableRow 
        id={el.id} 
        key={el.id} 
        date={el.date}
        orderNum={el.orderNum} 
        fromInst={el.fromInst}
        fromDistr={el.fromDistr}
        toDistr={el.toDistr}
        toInst={el.toInst}
        reason={el.reason}
        document={el.document}
        childId={props.id}
        guide={el.guideId}
        access={props.access} 
         />
    })

    return (<>
        <table>
        <thead className="ant-table-thead">
          <tr>
            <th className="ant-table-cell">Дата выбытия</th>  
            <th className="ant-table-cell">Номер приказа</th>
            <th className="ant-table-cell">Откуда выбыл (Район)</th>
            <th className="ant-table-cell">Откуда выбыл (ОО)</th>
            <th className="ant-table-cell">Куда выбыл (Район)</th>
            <th className="ant-table-cell">Куда выбыл (ОО)</th>
            <th className="ant-table-cell">Основание</th>
            <th className="ant-table-cell">Документ об образовании и его реквизиты (при наличии)</th>
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
    </>
    )
}

export default ChildEscapeTable
