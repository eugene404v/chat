import React from "react";
import { Input, Form } from "antd";

import { Pair } from "components";
import './Editable.scss'

function EditableText(props) {
  const [text, setText] = React.useState(props.text);
  const changeHandler = (e) => {
    setText(e.target.value);
  };
  return (
    <div className="editable">
      {!props.access && <Pair descr={props.descr}>{text}</Pair>}
      {props.access && (<>
        <Pair descr={props.descr}></Pair>
        <Form.Item
        shouldUpdate
          name={props.fieldName}
          rules={[
            {
              required: props.required,
              message: props.errMsg,
            },
          ]}
        >
         { !props.password ? <Input defaultValue={text} onChange={(e) => changeHandler(e)} maxLength={props.maxLength} placeholder={props.placeholder}/>
         : <Input.Password maxLength={props.maxLength} placeholder={props.placeholder} visibilityToggle/>}
        </Form.Item>
      </>)}
    </div>
  );
}

export default EditableText;
