import React from "react";
import { Form, Switch } from "antd";

import { Pair } from "components";
import './Editable.scss'

function EditableCheckbox(props) {
    const initialAnswer = props.initialBoolean ? 'Да' : 'Нет'
const [answer, setAnswer] = React.useState(initialAnswer)

const checkHandler = (e) => {
    alert(e.target.checked)
    if (e.target.checked == true) {
        setAnswer('Да')
    } else {
        setAnswer('Нет')
    }
}

  return (
    <div className="editable">
      <Pair descr={props.descr}>{answer}</Pair>
      {props.access && (
        <Form.Item name={props.fieldName} shouldUpdate getValuePropName={props.initialBoolean&&'checked'}>
          <Switch onChange={checkHandler} />
        </Form.Item>
      )}
    </div>
  );
}

export default EditableCheckbox;
