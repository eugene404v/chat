import React from "react";
import {Form, Button, Table} from 'antd'
import moment from 'moment';
import {useParams} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {fetchChild, refreshChild, editChild} from 'redux/reducers/childReducer'

import {EditableText, EditableDate, EditableSelect, PairLink, Pair, EditableCheckbox} from "components";




const data = [
  {
    key: '1',
    childrenCount: 1452,
    specialistsCount: 24,
  }
];

function Child() {
const urlId = useParams().id
const [access, setAccess] = React.useState(false)
const dispatch = useDispatch()
const childData = useSelector(state => state.childReducer)

React.useEffect(() => {
    dispatch(refreshChild())
    dispatch(fetchChild(urlId))
}, [dispatch, urlId])

const accessHandler = () => {
  if (access === false) {
    setAccess(true)
  } else {
    setAccess(false)
  }
}

const onFinish = values => {
  dispatch(editChild(values, urlId))
};

  return (
    <section className="home">
      <h1>КАРТА РЕБЕНКА</h1> 

      <Button onClick={accessHandler}>change access</Button>
{childData.isLoaded && <Form  onFinish={onFinish} initialValues={{ 
      name: childData.name,
      birthDate: moment(childData.birthDate),
      institution: childData.institution.id,
      addressReg: childData.addressReg,
      addressFact: childData.addressFact,
      document: childData.document,
      district: childData.institution.district,
      disability: childData.disability,
      invalid: childData.invalid,
      alcoholism: childData.alcoholism,
      smoking: childData.smoking,
      drugs: childData.drugs,
      other: childData.other,
      }} >
      <EditableText descr='ФИО' text={childData.name} access={access} fieldName='name'/>
      <EditableDate descr='Дата рождения' day={moment(childData.birthDate).format('YYYY.MM.DD').toString()} access={access} fieldName='birthDate'/>
      <EditableSelect descr='Организация' text={childData.institution.name} access={access} selectArray={[{id: 1, text: 'Ленинский'}, {id: 2, text: 'Кировский'}]} fieldName='institution' />
      <EditableText descr='Адрес регистрации' text={childData.addressReg} access={access} fieldName='addressReg'/>
      <EditableText descr='Адрес фактического проживания' text={childData.addressFact} access={access} fieldName='addressFact'/>
      <EditableText descr='Документ, удостоверяющий личность' text={childData.document} access={access} fieldName='document'/>
      <EditableSelect descr='Район' text={childData.institution.district} access={access} selectArray={[{id: 1, text: 'Ленинский'}, {id: 2, text: 'Кировский'}]} fieldName='district' />
      <EditableCheckbox descr='Ограниченные возможности здоровья' initialBoolean={childData.disability} access={access} fieldName='disability'/>
      <EditableCheckbox descr='Инвалидность' initialBoolean={childData.invalid} access={access} fieldName='invalid'/>
      <EditableCheckbox descr='Алкогольная зависимость' initialBoolean={childData.alcoholism} access={access} fieldName='alcoholism'/>
      <EditableCheckbox descr='Табачная зависимость' initialBoolean={childData.smoking} access={access} fieldName='smoking'/>
      <EditableCheckbox descr='Наркотическая зависимость' initialBoolean={childData.drugs} access={access} fieldName='drugs'/>
      <EditableCheckbox descr='Иная зависимость' initialBoolean={childData.other} access={access} fieldName='other'/>

      {access && <Button  type="primary" htmlType="submit">Сохранить изменения</Button>}
    </Form>}
    {childData.isLoaded && <Table dataSource={data} pagination={false}  bordered>
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

export default Child;
