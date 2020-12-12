import React from "react";
import { EditableCell, EditableRowTrigger } from "components";
import {useSelector, useDispatch} from 'react-redux'
import {fetchFamilyMprIds, refreshFamily, fetchFamily} from 'redux/reducers/familyReducer'
import {Alert } from 'antd'
import axios from 'axios'

const EditableRow = (props) => {
  const famData = useSelector(state => state.familyReducer)
  const dispatch = useDispatch()
  const [edit, setEdit] = React.useState(false);
  const [status, setStatus] = React.useState(props.status && props.status.name);
  const [statusId, setStatusId] = React.useState(props.status && props.status.id);
  const [dayStart, setDayStart] = React.useState(props.dateStart);
  const [dayEnd, setDayEnd] = React.useState(props.dateEnd);
  const [reasonStart, setReasonStart] = React.useState(props.reasonStart && props.reasonStart.name);
  const [reasonStartId, setReasonStartId] = React.useState(props.reasonStart && props.reasonStart.id);
  const [reasonEnd, setReasonEnd] = React.useState(props.reasonEnd && props.reasonEnd.name);
  const [reasonEndId, setReasonEndId] = React.useState(props.reasonEnd && props.reasonEnd.id);
  const [exists, setExists] = React.useState(true);

  const statusHandler = (val) => {
    setStatusId(val)
    setStatus(famData.familyMprStatusArr.find(el=> el.id == val).name)
  };

  const dayStartHandler = (_, dateString) => {
    setDayStart(dateString);
  };

  const dayEndHandler = (_, dateString) => {
    setDayEnd(dateString);
  };

  const reasonStartHandler = (val) => {
    setReasonStartId(val)
    setReasonStart(famData.familyMprReasonStartArr.find(el=> el.id == val).name)
  };

  const reasonEndHandler = (val) => {
    setReasonEndId(val)
    setReasonEnd(famData.familyMprReasonEndArr.find(el=> el.id == val).name)
  };

  const editHandler = () => {
    famData._guideFields && dispatch(fetchFamilyMprIds(famData._guideFields.familyMpr.fromId))
    setEdit(true);
  };

  const cancelHandler = () => {
    setEdit(false);
  };

  const saveHandler = () => {
    const stateData = {
      status: statusId, dateStart: dayStart, dateEnd: dayEnd, reasonStart: reasonStartId, reasonEnd: reasonEndId
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
  };

  const deleteHandler = (id) => {
    setExists(false);
    axios.post(`/family/delExtendFromFamily/familyMpr/${props.id}`, {}, {headers: {
      Accept: "text/json"
    }})
  };

  return (
    exists && (
      <tr index={props.id} display="table-row">
        <EditableCell select="true" editing={edit} selectArray={famData.familyMprStatusArr} onSelectChange={statusHandler}>{status}</EditableCell>
        <EditableCell day="true" editing={edit}  onDateChange={dayStartHandler}>{dayStart}</EditableCell>
        <EditableCell day="true" editing={edit} onDateChange={dayEndHandler}>{dayEnd}</EditableCell>
        <EditableCell select="true" editing={edit} selectArray={famData.familyMprReasonStartArr} onSelectChange={reasonStartHandler}>{reasonStart}</EditableCell>
        <EditableCell select="true" editing={edit} selectArray={famData.familyMprReasonEndArr} onSelectChange={reasonEndHandler}>{reasonEnd}</EditableCell>
        <EditableRowTrigger editing={edit} onedit={editHandler} onCancel={cancelHandler} onSave={saveHandler}/>
        <td>
          <button onClick={() => deleteHandler(props.id)}>X</button>
        </td>
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
      const [dayStart, setDayStart] = React.useState();
      const [dayEnd, setDayEnd] = React.useState();
      const [reasonStart, setReasonStart] = React.useState();
      const [reasonStartId, setReasonStartId] = React.useState();
      const [reasonEnd, setReasonEnd] = React.useState();
      const [reasonEndId, setReasonEndId] = React.useState();
  
      const statusHandler = (val) => {
        setStatusId(val)
        setStatus(famData.familyMprStatusArr.find(el=> el.id == val).name)
      };
    
      const dayStartHandler = (_, dateString) => {
        setDayStart(dateString);
      };
    
      const dayEndHandler = (_, dateString) => {
        setDayEnd(dateString);
      };
    
      const reasonStartHandler = (val) => {
        setReasonStartId(val)
        setReasonStart(famData.familyMprReasonStartArr.find(el=> el.id == val).name)
      };
    
      const reasonEndHandler = (val) => {
        setReasonEndId(val)
        setReasonEnd(famData.familyMprReasonEndArr.find(el=> el.id == val).name)
      };    
    
      const cancelHandler = () => {
        setAdding(false)
      }
    
      const saveHandler = () => {
        const stateData = {
          status: statusId, dateStart: dayStart, dateEnd: dayEnd, reasonStart: reasonStartId, reasonEnd: reasonEndId
        }
        if ((!stateData.status)||(!stateData.dateStart)||(!stateData.dateEnd)||(!stateData.reasonStart)||(!stateData.reasonEnd)) {
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
        <EditableCell day="true" editing={adding}  onDateChange={dayStartHandler} placeholder='Дата постановки'></EditableCell>
        <EditableCell day="true" editing={adding} onDateChange={dayEndHandler} placeholder='Дата снятия'></EditableCell>
        <EditableCell select="true" editing={adding} selectArray={famData.familyMprReasonStartArr} onSelectChange={reasonStartHandler} placeholder='Основания постановки'></EditableCell>
        <EditableCell select="true" editing={adding} selectArray={famData.familyMprReasonEndArr} onSelectChange={reasonEndHandler} placeholder='Основания снятия'></EditableCell>
        <EditableRowTrigger editing={true}  onCancel={cancelHandler} onSave={saveHandler}/>
      </tr>
      {error && <Alert message="Error" type="error" showIcon />}
      </>)
    }

  const mappedRows = props.data.map((el, i) => {
    return <EditableRow 
        id={el.id} 
        key={el.id} 
        type={el.type} 
        status={el.status}
        dateStart={el.dateStart} 
        dateEnd={el.dateEnd} 
        reasonStart={el.reasonStart}
        reasonEnd={el.reasonEnd}  
        guide={el.guideId}
        childId={props.id}
         />
  });

  return (
    <table>
      <thead className="ant-table-thead">
        <tr>
          <th className="ant-table-cell">Статус</th>
          <th className="ant-table-cell">Дата постановки на учет</th>
          <th className="ant-table-cell">Дата снятия с учета</th>
          <th className="ant-table-cell">Основания постановки</th>
          <th className="ant-table-cell">Основания снятия</th>
          <th className="ant-table-cell"></th>
        </tr>
      </thead>
      <tbody className="ant-table-tbody">
        {mappedRows}
        {adding && <NewRow id={famData.id}/>}
        {!adding && <button onClick={addHandler}>ADD NEW</button>}
      </tbody>
    </table>
  );
}

export default FamilyMprTable;
