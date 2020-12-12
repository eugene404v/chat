import React from "react";
import { Form, Input, Button } from "antd";
import moment from "moment";
import {useSelector, useDispatch} from 'react-redux'
import { addNews } from "redux/reducers/newsReducer";

const validateMessages = {
  required: "Заполните поле",
};

function NewNewsItem(props) {
    const newsData = useSelector(state => state.newsReducer)
    const  dispatch = useDispatch()

  const onFinish = (values) => {
    dispatch(addNews(values, newsData.page))
  };

  return (
    <Form
      name="nest-messages"
      onFinish={onFinish}
      validateMessages={validateMessages}
      initialValues={{
        author: newsData.user && newsData.user.fio,
        date: moment().format("YYYY-MM-DD").toString(),
      }}
    >
      <div className="news__hidden">
        <Form.Item name="author" style={{ diplay: "none" }} />
        <Form.Item name="date" style={{ diplay: "none" }} />
      </div>
      <Form.Item
        name="name"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input placeholder="Заголовок" />
      </Form.Item>
      <Form.Item
        name="text"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input.TextArea placeholder="Текст" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Сохранить
        </Button>
      </Form.Item>
      <Button htmlType="button" onClick={props.onCancel}>
        Отмена
      </Button>
    </Form>
  );
}

export default NewNewsItem;
