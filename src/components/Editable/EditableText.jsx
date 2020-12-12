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
      <Pair descr={props.descr}>{text}</Pair>
      {props.access && (
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
          <Input defaultValue={text} onChange={(e) => changeHandler(e)} maxLength={props.maxLength} placeholder={props.placeholder}/>
        </Form.Item>
      )}
    </div>
  );
}

export default EditableText;
