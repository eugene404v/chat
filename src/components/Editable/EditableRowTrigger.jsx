import React from 'react'

function EditableRowTrigger(props) {
    return (
        <td>
            {props.editing 
            ? <div><button onClick={props.onSave}>yes</button><button onClick={props.onCancel}>no</button></div>
            : <button onClick={props.onedit}>rrr</button> }
            
        </td>
    )
}

export default EditableRowTrigger
