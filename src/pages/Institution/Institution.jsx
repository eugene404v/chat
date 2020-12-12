import React from "react";
import {Form, Button, Table, Spin} from 'antd'
import moment from 'moment';
import {useParams} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {fetchInstitution, editInstitution, fetchSelects} from 'redux/reducers/institution'

import {EditableText, EditableDate, EditableSelect, PairLink, Pair} from "components";
import "./Institution.scss";





function Home() {
const urlId = useParams().id
const [access, setAccess] = React.useState(false)
const dispatch = useDispatch()
const pageData = useSelector(state => state.institutionReducer)


React.useEffect(() => {
    dispatch(fetchInstitution(urlId))
}, [dispatch, urlId])

const accessHandler = () => {
  if (access === false) {
    setAccess(true)
    pageData._guideFields && dispatch(fetchSelects(pageData._guideFields.district.fromId))
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
      district: pageData.district.id,
      lead: pageData.lead.id,
      operator: pageData.operator.id,
      orderNum: pageData.orderNum,
      orderDate: moment(pageData.orderDate),
      silence: pageData.silence
      }} >
      <EditableText descr='Полное наименование' text={pageData.fullName} access={access} fieldName='fullName'/>
      <EditableText descr='Краткое наименование' text={pageData.name} access={access} fieldName='name' />
      <EditableText descr='Адрес' text={pageData.address} access={access} fieldName='address' />
      <EditableSelect descr='Район' text={pageData.district.name} access={access} selectArray={pageData.districtsArr} fieldName='district' />
      <EditableSelect descr='Руководитель' text={pageData.lead.fio} access={access} selectArray={pageData.leadsArr} fieldName='lead' />
      <PairLink descr='Список детей, прикрепленных к организации' link={`/children/filter/institution/${urlId}`} text='Перейти' />
      <PairLink descr='Список специалистов организации' link={`/speclist/filter/institution/${urlId}`} text='Перейти' />
      <EditableSelect descr='Оператор организации' text={pageData.operator.fio} access={access} selectArray={pageData.operatorsArr} fieldName='operator'/>
      <EditableText descr='Номер приказа о назначении' text={pageData.orderNum} access={access} fieldName='orderNum' />
      <EditableDate descr='Дата приказа о назначении' day={moment(pageData.orderDate).format('YYYY-MM-DD').toString()} access={access} fieldName='orderDate' />
      <EditableText descr='Обязательство о неразглашении' text={pageData.silence} access={access} fieldName='silence' />
      {access && <Button  type="primary" htmlType="submit">Сохранить изменения</Button>}
    </Form> : <Spin size="large" />}
    {pageData.isLoaded && <Table pagination={false} dataSource={pageData.tableData}  bordered>
      <Table.Column title="Всего детей, состоящих на профилактическом учете" dataIndex="allChildren" key="allChildren" width="200px"/>
      <Table.ColumnGroup title="из них по видам учета:">
        <Table.Column title="ВШУ" dataIndex="2" key="2" />
        <Table.Column title="ПДН" dataIndex="3" key="3" />
        <Table.Column title="СОП" dataIndex="4" key="4" />
        <Table.Column title="ТЖС" dataIndex="5" key="5" />
        <Table.Column title="УИН" dataIndex="6" key="6" />
        <Table.Column title="МПР" dataIndex="7" key="7" />
        <Table.Column title="МСК" dataIndex="8" key="8" />
        <Table.Column title="Группа риска" dataIndex="9" key="9" />
      </Table.ColumnGroup>
      <Table.Column title="Количество специалистов" dataIndex="countSpecs" key="countSpecs" />
    </Table>}

    
      
      
    </section>
  );
}

export default Home;
