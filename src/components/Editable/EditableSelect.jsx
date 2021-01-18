import React from "react";
import { Select, Form } from "antd";

import { Pair } from "components";
import './Editable.scss'

function EditableSelect(props) {
  const [text, setText] = React.useState(props.text);
  const changeHandler = (value) => {
    setText(props.selectArray.find(el => el.id===value).name);
    props.onSelect && props.onSelect(value)
  };
  
  return (
    <div className="editable">
      {!props.access && <Pair descr={props.descr}>{Array.isArray(text)?text[0].name:text}</Pair>}
      {props.access && (<>
        <Pair descr={props.descr}></Pair>
        <Form.Item name={props.fieldName} shouldUpdate style={{width: '100%'}}>
          <Select onSelect={changeHandler} onFocus={props.onFocus} placeholder={props.placeholder} className='editable__select' disabled={props.disabled} mode={props.multiple && "multiple"}>
            {props.selectArray && props.selectArray.map((el) => {
              return <Select.Option value={el.id} key={el.name} title={el.name}>{el.name}</Select.Option>;
            })}
          </Select>
        </Form.Item>
      </>)}
    </div>
  );
}

export default EditableSelect;
