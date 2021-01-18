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
      {!props.access && <Pair descr={props.descr}>{day}</Pair>}
      {props.access && (<>
        <Pair descr={props.descr}></Pair>
        {props.required && <Form.Item name={props.fieldName} shouldUpdate rules={[{ required: true, message: 'Пожалуйста заполните поле' }]}>
          <DatePicker onChange={(date, dateString) => changeHandler(dateString)} placeholder={props.placeholder} format="DD-MM-YYYY"/>
        </Form.Item>}
        {!props.required && <Form.Item name={props.fieldName} shouldUpdate >
          <DatePicker onChange={(date, dateString) => changeHandler(dateString)} placeholder={props.placeholder} format="DD-MM-YYYY"/>
        </Form.Item>}
      </>)}
    </div>
  );
}

export default EditableDate;
