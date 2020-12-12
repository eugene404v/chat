import React from "react";
import { Form, DatePicker } from "antd";

import { Pair } from "components";
import './Editable.scss'

function EditableDate(props) {
  const [day, setDay] = React.useState(props.day);
  const changeHandler = (dateString) => {
    setDay(dateString);
  };
  return (
    <div className="editable">
      <Pair descr={props.descr}>{day}</Pair>
      {props.access && (
        <Form.Item name={props.fieldName} shouldUpdate>
          <DatePicker onChange={(date, dateString) => changeHandler(dateString)} placeholder={props.placeholder} format="YYYY-MM-DD"/>
        </Form.Item>
      )}
    </div>
  );
}

export default EditableDate;
