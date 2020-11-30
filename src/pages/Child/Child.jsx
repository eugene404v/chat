import React from "react";
import axios from 'axios'
import {Form, Button, Table} from 'antd'
import moment from 'moment';

import {EditableText, EditableDate, EditableSelect, PairLink} from "components";




const data = [
  {
    key: '1',
    childrenCount: 1452,
    specialistsCount: 24,
  }
];

function Home() {
const [access, setAccess] = React.useState(false)

React.useEffect(() => {
axios
  .get(`https://jsonplaceholder.typicode.com/users`)
  .then(function (response) {
    console.log(JSON.stringify(response.data)) 
  });
}, [])

const accessHandler = () => {
  if (access === false) {
    setAccess(true)
  } else {
    setAccess(false)
  }
}

const onFinish = values => {
  axios
  .post('/api', {...values})
  .then(function (response) {
    console.log(JSON.stringify(response.data)) 
  });
};

  return (
    <section className="home">
      <h1>КАРТА РЕБЕНКА</h1>
      <Button onClick={accessHandler}>change access</Button>

    <Form onFinish={onFinish} initialValues={{ 
      fullName: 'ИВАН',
      birthDate: moment('2020-06-09T12:40:14+0000'),

      shortName: 'ПФРО МГБ',
      address: 'г.Ленинск, ул.Ленина, дом Ленина',
      district: 'Ленинский',
      lead: 'Ваня',
      operator: 'Гоша',
      orderNum: '123',
      remember: true,
      }} >
      <EditableText descr='ФИО' text='ИВАН' access={access} fieldName='fullName'/>
      <EditableDate descr='Дата приказа о назначении' day='2003-05-11' access={access} fieldName='birthDate' />

      <EditableText descr='Краткое наименование' text='ПФРО МГБ' access={access} fieldName='shortName' />
      <EditableText descr='Адрес' text='г.Ленинск, ул.Ленина, дом Ленина' access={access} fieldName='address' />
      <EditableSelect descr='Район' text='Ленинский' access={access} selectArray={[{value: 'Ленинский', text: 'Ленинский'}, {value: 'Кировский', text: 'Кировский'}]} fieldName='district' />
      <EditableSelect descr='Руководитель' text='Ваня' access={access} selectArray={[{value: 'Ваня', text: 'Ваня'}, {value: 'Димас', text: 'Димас'}]} fieldName='lead' />
      <PairLink descr='Список детей, прикрепленных к организации' link='/' text='Перейти' />
      <PairLink descr='Список специалистов организации' link='/' text='Перейти' />
      <EditableSelect descr='Оператор организации' text='Гоша' access={access} selectArray={[{value: 'Гоша', text: 'Гоша'}, {value: 'Пидор', text: 'Пидор'}]} fieldName='operator'/>
      <EditableText descr='Номер приказа о назначении' text='123' access={access} fieldName='orderNum' />
      <EditableDate descr='Дата приказа о назначении' day='2003-05-11' access={access} fieldName='orderDate' />
      <EditableSelect descr='Обязательство о неразглашении' text='Какое?' access={access} selectArray={[{value: 'Какое?', text: 'Какое?'}, {value: 'Такое', text: 'Такое'}]} fieldName='silence' />
      {access && <Button  type="primary" htmlType="submit">Сохранить изменения</Button>}
    </Form>

    <Table dataSource={data} pagination={false}  bordered>
      <Table.Column title="Всего детей, состоящих на профилактическом учете" dataIndex="childrenCount" key="childrenCount" width="200px"/>
      <Table.ColumnGroup title="из них по видам учета:">
        <Table.Column title="ВШУ" dataIndex="firstName" key="firstName" />
        <Table.Column title="ПДН" dataIndex="firstName" key="firstName" />
        <Table.Column title="СОП" dataIndex="firstName" key="firstName" />
        <Table.Column title="ТЖС" dataIndex="firstName" key="firstName" />
        <Table.Column title="УИН" dataIndex="firstName" key="firstName" />
        <Table.Column title="МПР" dataIndex="firstName" key="firstName" />
        <Table.Column title="МСК" dataIndex="firstName" key="firstName" />
        <Table.Column title="Группа риска" dataIndex="firstName" key="firstName" />
      </Table.ColumnGroup>
      <Table.Column title="Количество специалистов" dataIndex="age" key="age" />
    </Table>
      
      
    </section>
  );
}

export default Home;
