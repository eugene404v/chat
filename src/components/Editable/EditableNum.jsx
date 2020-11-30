import React from "react";
import { InputNumber, Form } from "antd";

import { Pair } from "components";
import './Editable.scss'

function EditableNum(props) {
  const [text, setText] = React.useState(props.text);
  const changeHandler = (e) => {
    setText(e);
  };
  return (
    <div className="editable">
      <Pair descr={props.descr}>{text}</Pair>
      {props.access && (
        <Form.Item
          name={props.fieldName}
          rules={[
            {
              required: props.required,
              message: props.errMsg,
            },
          ]}
        >
          <InputNumber defaultValue={text} onChange={(e) => changeHandler(e)} />
        </Form.Item>
      )}
    </div>
  );
}

export default EditableNum;
