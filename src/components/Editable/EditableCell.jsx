import React from 'react'
import {Select, Input, DatePicker, Form} from 'antd'
import moment from 'moment'

function EditableCell({
    editing,
    children, placeholder, maxLength, disabled,
    select, day, input, selectArray, renderSelect,
    onDateChange, onInputChange, onSelectFocus, onSelectChange,
    ...restProps
  }) {



    return (
        <td>
      {editing ? (
        
          <>
          {select && <Select defaultValue={children} placeholder={placeholder} onFocus={onSelectFocus} onChange={onSelectChange} disabled={disabled}>{selectArray && selectArray.map(el=> {
            return (
            <Select.Option value={el.id} title={el.name}>{el.name}</Select.Option>
            )
          })}</Select>}
          {day && <DatePicker disabled={disabled} defaultValue={children && moment(children)} placeholder={placeholder} onChange={onDateChange} allowClear={false}/>}
          {input && <Input disabled={disabled} defaultValue={children} onChange={onInputChange} placeholder={placeholder} maxLength={maxLength}/>}
        </>
      ) : (
        children
      )}
    </td>
    )
}

export default EditableCell
