import React from "react";
import { EditableCell, EditableRowTrigger } from "components";
import {useSelector, useDispatch} from 'react-redux'
import {fetchFamilySopIds, refreshFamily, fetchFamily} from 'redux/reducers/familyReducer'
import {Alert, Button} from 'antd'
import axios from 'axios'
import { DeleteOutlined, PlusSquareOutlined   } from "@ant-design/icons";


const EditableRow = (props) => {
  const famData = useSelector(state => state.familyReducer)
  const dispatch = useDispatch()
  const [edit, setEdit] = React.useState(false);
  const [status, setStatus] = React.useState(props.status && props.status);
  const [statusId, setStatusId] = React.useState(props.status && props.status.id);
  const [day, setDay] = React.useState(props.date);
  const [reason, setReason] = React.useState(props.reason && props.reason.name);
  const [reasonId, setReasonId] = React.useState(props.reason && props.reason.id);
  const [exists, setExists] = React.useState(true);
  const [tempStatus, setTempStatus] = React.useState(props.status === 'Поставлен'?0:1)

  const statusHandler = (val) => {
    setStatusId(val)
    setStatus(val)
    setTempStatus(val === 'Поставлен'?0:1)
    
  };

  const focusHandler = () => {
    famData._guideFields && dispatch(fetchFamilySopIds(famData._guideFields.familySop.fromId, tempStatus))
  }

  const dayHandler = (_, dateString) => {
    setDay(dateString);
  };


  const reasonHandler = (val) => {
    setReasonId(val)
    setReason(famData.familySopReasonArr.find(el=> el.id == val).name)
  };


  const editHandler = () => {
    famData._guideFields && dispatch(fetchFamilySopIds(famData._guideFields.familySop.fromId, tempStatus))
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
    axios.post(`/family/editExtendedInFamily/familySop/${props.id}/${props.childId}`,formdata, {
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
    axios.post(`/family/delExtendFromFamily/familySop/${props.id}/${props.childId}`, {}, {headers: {
      Accept: "text/json"
    }})
  };

  return (
    exists && (
      <tr>
        <EditableCell select="true" editing={edit} selectArray={famData.familySopStatusArr} onSelectChange={statusHandler}>{status}</EditableCell>
        <EditableCell day="true" editing={edit}  onDateChange={dayHandler}>{day}</EditableCell>
        <EditableCell select="true" editing={edit} selectArray={famData.familySopReasonArr} onSelectFocus={focusHandler} onSelectChange={reasonHandler}>{reason}</EditableCell>
        {props.access && <EditableRowTrigger editing={edit} onedit={editHandler} onCancel={cancelHandler} onSave={saveHandler}/>}
        {props.access && <td><Button onClick={()=>deleteHandler(props.parentId)}><DeleteOutlined /></Button></td>}
      </tr>
    )
  );
};

function FamilySopTable(props) {
  const dispatch = useDispatch()
  const famData = useSelector(state => state.familyReducer)
  const [adding, setAdding] = React.useState(false)
  

  const addHandler = () => {
    //famData._guideFields && dispatch(fetchFamilySopIds(famData._guideFields.familySop.fromId, tempStatus))
      setAdding(true)
    }

    const NewRow = (props) => {
      const [error, setError] = React.useState(false)
      const [status, setStatus] = React.useState();
      const [statusId, setStatusId] = React.useState();
      const [day, setDay] = React.useState();
      const [reason, setReason] = React.useState();
      const [reasonId, setReasonId] = React.useState();
      const [sopIds, setSopIds] = React.useState();
      const [tempStatus, setTempStatus] = React.useState()
      const [arr, setArr] = React.useState()
      


  
      
    
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
          axios.post(`/family/addExtendedToFamily/familySop/${props.id}`,formdata, {
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

      const statusHandler = (val) => {
        setStatusId(val)
        setStatus(val)
        setTempStatus(val === 'Поставлен'?0:1)

        //famData._guideFields && dispatch(fetchFamilySopIds(famData._guideFields.familySop.fromId, tempStatus))
       /*alert(tempStatus)
          axios
          .get(`/family/loadSelect/sop?forEnd=${tempStatus}`, {
            headers: {
              Accept: "text/json",
            },
          })
          .then(function (response) {
           // dispatch(setFamily({ familySopReasonArr: response.data.data }));
            //dispatch(setFamily({ familySopStatusArr: [{name:'Поставлен', id: 'Поставлен'}, {name:'Снят', id: 'Снят'}] }));
          });
       */
      };

      const focusHandler = () => {
        axios
        .get(`/family/loadSelect/sop?forEnd=${tempStatus}`, {
          headers: {
            Accept: "text/json",
          },
        })
        .then(function (response) {
          setArr(response.data.data)
        });
      }
  
      return (<>
      <tr>
        <EditableCell select="true" editing={adding} selectArray={[{name:'Поставлен', id: 'Поставлен'}, {name:'Снят', id: 'Снят'}] } onSelectChange={statusHandler} placeholder='Статус'></EditableCell>
        <EditableCell day="true" editing={adding}  onDateChange={dayHandler} placeholder='Дата '></EditableCell>
        <EditableCell select="true" editing={adding} selectArray={arr} onSelectFocus={focusHandler} onSelectChange={reasonHandler} placeholder='Основания ' disabled={!statusId}></EditableCell>
        <EditableRowTrigger editing={true}  onCancel={cancelHandler} onSave={saveHandler}/>
      </tr>
      {error && <Alert message="Заполните поля" type="error" showIcon />}
      </>)
    }

  const mappedRows = Array.isArray(props.data) && props.data.map((el, i) => {
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
          <th className="ant-table-cell">Дата постановки/снятия</th>
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

export default FamilySopTable;


