import React from "react";
import { Button, Form, Input } from "antd";

import Pair from "./Pair";

function PairInputBtn(props) {
  return (
    <Form onFinish={props.onFinish}>
      <Pair descr={props.descr}>
        <Form.Item name={props.fieldName} rules={[{ required: true, message: 'Please input your username!' }]}>
            <Input placeholder={props.placeholder}/>
        </Form.Item>
      </Pair>
      <Button  type="primary" htmlType="submit">{props.submitText}</Button>
    </Form>
  );
}

export default PairInputBtn;
