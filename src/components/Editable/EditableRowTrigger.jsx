import React from 'react'
import { EditOutlined, CheckCircleOutlined, CloseCircleOutlined  } from "@ant-design/icons";
import { Button } from 'antd';

function EditableRowTrigger(props) {
    return (
        <td>
            {props.editing 
            ? <div style={{display: 'flex'}}><Button onClick={props.onSave}><CheckCircleOutlined /></Button><Button onClick={props.onCancel}><CloseCircleOutlined /></Button></div>
            : <Button onClick={props.onedit}><EditOutlined /></Button> }
            
        </td>
    )
}

export default EditableRowTrigger



