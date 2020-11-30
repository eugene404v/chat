import React from "react";
import {Form, Button, Table, Spin} from 'antd'
import moment from 'moment';
import {useParams} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {fetchInstitution, editInstitution} from 'redux/reducers/institution'

import {EditableText, EditableDate, EditableSelect, PairLink, Pair} from "components";
import "./Institution.scss";



const data = [
  {
    key: '1',
    childrenCount: 1452,
    specialistsCount: 24,
  }
];

function Home() {
const urlId = useParams().id
const [access, setAccess] = React.useState(false)
const dispatch = useDispatch()
const pageData = useSelector(state => state.institutionReducer)

React.useEffect(() => {
    dispatch(fetchInstitution(urlId))
}, [dispatch])

const accessHandler = () => {
  if (access === false) {
    setAccess(true)
  } else {
    setAccess(false)
  }
}

const onFinish = values => {
  dispatch(editInstitution(values, urlId))
};

  return (
    <section className="home">
      <h1>КАРТА УЧРЕЖДЕНИЯ</h1> 

      <Button onClick={accessHandler}>change access</Button>
{pageData.isLoaded ? <Form dependencies={[pageData]}  onFinish={onFinish} initialValues={{ 
      fullName: pageData.fullName,
      name: pageData.name,
      address: pageData.address,
      district: pageData.district,
      lead: pageData.lead.id,
      operator: pageData.operator.id,
      orderNum: pageData.operator.orderNum,
      orderDate: moment(pageData.operator.orderDate),
      silence: pageData.operator.silence
      }} >
      <EditableText descr='Полное наименование' text={pageData.fullName} access={access} fieldName='fullName'/>
      <EditableText descr='Краткое наименование' text={pageData.name} access={access} fieldName='name' />
      <EditableText descr='Адрес' text={pageData.address} access={access} fieldName='address' />
      <EditableSelect descr='Район' text={pageData.district} access={access} selectArray={[{id: 1, text: 'Ленинский'}, {id: 2, text: 'Кировский'}]} fieldName='district' />
      <EditableSelect descr='Руководитель' text={pageData.lead.name} access={access} selectArray={[{id: 1, text: 'Ваня'}, {id: 2, text: 'Димас'}]} fieldName='lead' />
      <PairLink descr='Список детей, прикрепленных к организации' link={`/children/filter/institution/${urlId}`} text='Перейти' />
      <PairLink descr='Список специалистов организации' link={`/speclist/view/${urlId}`} text='Перейти' />
      <EditableSelect descr='Оператор организации' text={pageData.operator.name} access={access} selectArray={[{id: 1, text: 'Гоша'}, {id: 2, text: 'Алеша'}]} fieldName='operator'/>
      <Pair descr='Номер приказа о назначении'>{pageData.operator.orderNum}</Pair>
      <Pair descr='Дата приказа о назначении'>{pageData.operator.orderDate}</Pair>
      <Pair descr='Обязательство о неразглашении'>{pageData.operator.silence}</Pair>
      {access && <Button  type="primary" htmlType="submit">Сохранить изменения</Button>}
    </Form> : <Spin size="large" />}
    {pageData.isLoaded && <Table dataSource={data} pagination={false}  bordered>
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
      <Table.Column title="Количество специалистов" dataIndex="specialistsCount" key="specialistsCount" />
    </Table>}

    
      
      
    </section>
  );
}

export default Home;
