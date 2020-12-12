import React from "react";
import axios from "axios";
import { Form, Input, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import {useHistory} from 'react-router-dom'

import { Button, Block } from "components";

function LoginForm() {
  const history = useHistory()
  const onFinish = (data) => {
    const formData = {};
    var formdata = new FormData();
    let key;
    for (key in data) {
      formdata.append(key, data[key]);
    }
    axios
      .post("/users/enter", formdata, {
        headers: {
          Accept: "text/json",
          "Content-Type": "multipart/form-data",
        },
      })
      .then(function (response) {
        history.push('/parents/view/1')
      });
  };

  return (
    <div>
      <div className="auth__top">
        <h2>Войти в аккаунт</h2>
        <p>Пожалуйста, войдите в свой аккаунт</p>
      </div>
      <Block>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your Username!" }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button button--large"
            >
              Войти в аккаунт
            </Button>
          </Form.Item>
        </Form>
        <Link to="/register" className="auth__registerlink">
          Зарегистрироваться
        </Link>
      </Block>
    </div>
  );
}

export default LoginForm;
