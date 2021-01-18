import React from "react";
import { EditableCell, EditableRowTrigger } from "components";
import {useSelector, useDispatch} from 'react-redux'
import {fetchFamilyMprIds, refreshFamily, fetchFamily} from 'redux/reducers/familyReducer'
import {Alert, Button} from 'antd'
import axios from 'axios'
import { DeleteOutlined, PlusSquareOutlined   } from "@ant-design/icons";


const EditableRow = (props) => {
  const famData = useSelector(state => state.familyReducer)
  const dispatch = useDispatch()
  const [edit, setEdit] = React.useState(false);
  const [status, setStatus] = React.useState(props.status && props.status);
  const [statusId, setStatusId] = React.useState(props.status && props.status);
  const [day, setDay] = React.useState(props.date);
  const [reason, setReason] = React.useState(props.reason && props.reason.name);
  const [reasonId, setReasonId] = React.useState(props.reason && props.reason.id);
  const [exists, setExists] = React.useState(true);
  const [tempStatus, setTempStatus] = React.useState(props.status === 'Утверждена'?0:1)

  const statusHandler = (val) => {
    setStatusId(val)
    setStatus(val)
    setTempStatus(val === 'Утверждена'?0:1)
  };

  const focusHandler = () => {
    famData._guideFields && dispatch(fetchFamilyMprIds(famData._guideFields.familyMpr.fromId, tempStatus))
  }


  const dayHandler = (_, dateString) => {
    setDay(dateString);
  };


  const reasonHandler = (val) => {
    setReasonId(val)
    setReason(famData.familyMprReasonArr.find(el=> el.id == val).name)
  };

  const editHandler = () => {
    famData._guideFields && dispatch(fetchFamilyMprIds(famData._guideFields.familyMpr.fromId, status))
    setEdit(true);
  };

  const cancelHandler = () => {
    setEdit(false);
  };

  const saveHandler = () => {
    const stateData = {
      status: statusId, date: day, reason: reasonId
    }
    const formData = {}
    var formdata = new FormData();
    let key
    for (key in stateData){
        formdata.append(key, stateData[key])
    }
    axios.post(`/family/editExtendedInFamily/familyMpr/${props.id}/${props.childId}`,formdata, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': "text/json"
      },
    })
    .then(function (response) {
      setEdit(false)
    })
  };

  const deleteHandler = (id) => {
    setExists(false);
    axios.post(`/family/delExtendFromFamily/familyMpr/${props.id}/${props.childId}`, {}, {headers: {
      Accept: "text/json"
    }})
  };

  return (
    exists && (
      <tr>
        <EditableCell select="true" editing={edit} selectArray={famData.familyMprStatusArr} onSelectChange={statusHandler}>{status}</EditableCell>
        <EditableCell day="true" editing={edit}  onDateChange={dayHandler}>{day}</EditableCell>
        <EditableCell select="true" editing={edit} selectArray={famData.familyMprReasonArr} onSelectFocus={focusHandler} onSelectChange={reasonHandler}>{reason}</EditableCell>
        {props.access && <EditableRowTrigger editing={edit} onedit={editHandler} onCancel={cancelHandler} onSave={saveHandler}/>}
        {props.access && <td><Button onClick={()=>deleteHandler(props.parentId)}><DeleteOutlined /></Button></td>}
      </tr>
    )
  );
};

function FamilyMprTable(props) {
  const dispatch = useDispatch()
  const famData = useSelector(state => state.familyReducer)
  const [adding, setAdding] = React.useState(false)

  const addHandler = () => {
    famData._guideFields && dispatch(fetchFamilyMprIds(famData._guideFields.familyMpr.fromId))
      setAdding(true)
    }

    const NewRow = (props) => {
      const [error, setError] = React.useState(false)
      const [status, setStatus] = React.useState();
      const [statusId, setStatusId] = React.useState();
      const [day, setDay] = React.useState();
      const [reason, setReason] = React.useState();
      const [reasonId, setReasonId] = React.useState();
      const [tempStatus, setTempStatus] = React.useState()
      const [arr, setArr] = React.useState()
  
      const statusHandler = (val) => {
        setStatusId(val)
        setStatus(val)
        setTempStatus(val === 'Утверждена'?0:1)
      };

      const focusHandler = () => {
        axios
        .get(`/family/loadSelect/mpr?forEnd=${tempStatus}`, {
          headers: {
            Accept: "text/json",
          },
        })
        .then(function (response) {
          setArr(response.data.data)
        });
      }
    
      const dayHandler = (_, dateString) => {
        setDay(dateString);
      };
    
    
      const reasonHandler = (val) => {
        setReasonId(val)
        setReason(arr.find(el=> el.id == val).name)
      };

      const cancelHandler = () => {
        setAdding(false)
      }
    
      const saveHandler = () => {
        const stateData = {
          status: statusId, date: day, reason: reasonId
        }
        if ((!stateData.status)||(!stateData.date)||(!stateData.reason)) {
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
          axios.post(`/family/addExtendedToFamily/familyMpr/${props.id}`,formdata, {
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
        <EditableCell select="true" editing={adding} selectArray={famData.familyMprStatusArr} onSelectChange={statusHandler} placeholder='Статус'></EditableCell>
        <EditableCell day="true" editing={adding}  onDateChange={dayHandler} placeholder='Дата '></EditableCell>
        <EditableCell select="true" editing={adding} selectArray={arr} onSelectFocus={focusHandler} onSelectChange={reasonHandler} placeholder='Основания ' disabled={!statusId}></EditableCell>
        <EditableRowTrigger editing={true}  onCancel={cancelHandler} onSave={saveHandler}/>
      </tr>
      {error && <Alert message="Заполните поля" type="error" showIcon />}
      </>)
    }

  const mappedRows = props.data.map((el, i) => {
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
  });

  return (<>
    <table>
      <thead className="ant-table-thead">
        <tr>
          <th className="ant-table-cell">Статус</th>
          <th className="ant-table-cell">Дата снятия/постановки</th>
          <th className="ant-table-cell">Основания постановки/снятия</th>
          <th className="ant-table-cell"></th>
          {props.access && <th className="ant-table-cell"></th>}
        </tr>
      </thead>
      <tbody className="ant-table-tbody">
        {mappedRows}
        {adding && <NewRow id={famData.id}/>}
        
      </tbody>
    </table>
    {!adding && <Button onClick={addHandler}><PlusSquareOutlined />Добавить</Button>}
    </>
  );
}

export default FamilyMprTable;
