import React from "react";
import { Button, Form, Input } from "antd";

import Pair from "./Pair";

function PairInputBtn(props) {
  return (
    <Form onFinish={props.onFinish} style={{display: 'flex'}}>
      
      <Pair descr={props.descr}>
        <Form.Item name={props.fieldName} rules={[{ required: true, message: 'Пожалуйста заполните поле' }]} style={{margin: '0', marginBottom: '0'}}>
            <Input placeholder={props.placeholder}/>
        </Form.Item>
      </Pair>
      <Button   htmlType="submit">{props.submitText}</Button>
    </Form>
  );
}

export default PairInputBtn;
