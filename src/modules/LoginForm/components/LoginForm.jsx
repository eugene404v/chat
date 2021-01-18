import React from "react";
import axios from "axios";
import { Form, Input, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import {useHistory} from 'react-router-dom'

import { Button, Block } from "components";
import { useDispatch } from "react-redux";
import {fetchMe} from 'redux/reducers/userReducer'

function LoginForm() {
  const history = useHistory()
  const  dispatch = useDispatch()
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
        if (response.data.success === true) {
          dispatch(fetchMe())
          history.push('/')
        } else {
          alert(response.data.info)
        }
        
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
            rules={[{ required: true, message: "Пожалуйста введите свой логин!" }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Логин"
              size="large"
              autoComplete='off'
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Пожалуйста, введите свой пароль!" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Пароль"
              size="large"
              visibilityToggle={true}
              autoComplete='off'
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

      </Block>
    </div>
  );
}

export default LoginForm;
