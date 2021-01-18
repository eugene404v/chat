import React from 'react'
import {Select, Input, DatePicker, Form} from 'antd'
import moment from 'moment'
import './Editable.scss'

function EditableCell({
    editing,
    children, placeholder, maxLength, disabled,
    select, day, input, selectArray, renderSelect,
    onDateChange, onInputChange, onSelectFocus, onSelectChange,
    ...restProps
  }) {



    return (
        <td style={day && {whiteSpace:'nowrap'}}>
      {editing ? (
        
          <>
          {select && <Select className='editable--100p' defaultValue={children} placeholder={placeholder} onFocus={onSelectFocus} onChange={onSelectChange} disabled={disabled} style={{whiteSpace:'normal', maxWidth:'100%', height: 'auto'}}>{selectArray && selectArray.map(el=> {
            return (
            <Select.Option value={el.id} title={el.name}>{el.name}</Select.Option>
            )
          })}</Select>}
          {day && <DatePicker disabled={disabled} defaultValue={children && (children !=='0000-00-00' ?  moment(children) : moment())} placeholder={placeholder} onChange={onDateChange} allowClear={false}/>}
          {input && <Input disabled={disabled} defaultValue={children} onChange={onInputChange} placeholder={placeholder} maxLength={maxLength}/>}
        </>
      ) : (
        day ? (children !== '0000-00-00' ? moment(children).format('DD-MM-YYYY').toString():'Не указана') : children
      )}
    </td>
    )
}

export default EditableCell
