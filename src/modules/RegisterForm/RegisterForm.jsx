import React from "react";
import { Form, Input} from "antd";
import { UserOutlined, LockOutlined, InfoCircleTwoTone  } from "@ant-design/icons";
import { Link } from "react-router-dom";

import { Button, Block } from "components";

function RegisterForm() {
    const [isSucces, setSucces] = React.useState(true)
    const onFinish = (values) => {
        console.log("Received values of form: ", values);
      };
    
      return (
        <div>
          <div className="auth__top">
            <h2>Зарегистрируйтесь</h2>
            <p>Пожалуйста,</p>
          </div>
          
          <Block>{!isSucces ? (
              
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
                  prefix={<UserOutlined className="site-form-item-icon" type="email" />}
                  placeholder="Email"
                  size="large"
                  
                />
              </Form.Item>
              <Form.Item
                name="username"
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
                  placeholder="Пароль"
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
                  placeholder="Повторите пароль"
                  size="large"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button button--large"
                >
                  Зарегистрироваться
                </Button>
              </Form.Item>
            </Form>
          ) : (
              <div className="auth__success">
                  <InfoCircleTwoTone style={{fontSize: 50, display: 'block', }}/>
                  <h2>Подтвердите свой аккаунт</h2>
                  <p>На почту вам отправлено письмо со ссылкой для подтверждения аккаунта</p>
            </div>
          )}
            
            <Link to="/login" className="auth__registerlink">
              Войти в аккаунт
            </Link>
          </Block>
        </div>
      );
}

export default RegisterForm
