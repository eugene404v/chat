import React from "react";
import { Select, Form } from "antd";

import { Pair } from "components";
import './Editable.scss'

function EditableSelect(props) {
  const [text, setText] = React.useState(props.text);
  const changeHandler = (value) => {
    setText(props.selectArray.find(el => el.id===value).text);
  };
  return (
    <div className="editable">
      <Pair descr={props.descr}>{text}</Pair>
      {props.access && (
        <Form.Item name={props.fieldName} shouldUpdate>
          <Select onSelect={value => changeHandler(value)} >
            {props.selectArray.map((el) => {
              return <Select.Option value={el.id} key={el.text} title={el.text}>{el.text}</Select.Option>;
            })}
          </Select>
        </Form.Item>
      )}
    </div>
  );
}

export default EditableSelect;
