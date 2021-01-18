import React from "react";
import {Form, Button, Table, Spin} from 'antd'
import moment from 'moment';
import {useParams} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {fetchInstitution, editInstitution, fetchSelects, refreshInstitution} from 'redux/reducers/institution'
import { EditOutlined } from "@ant-design/icons";
import {EditableText, EditableDate, EditableSelect, EditableCheckbox, PairLink, Pair, AsyncSelect} from "components";
import "./Institution.scss";
import axios from "axios";





function Home() {
const [urlId, setUrlId] = React.useState(useParams().id)
const [edit, setEdit] = React.useState(false)
const [access, setAccess] = React.useState(false)
const dispatch = useDispatch()
const pageData = useSelector(state => state.institutionReducer)
const userData = useSelector(state => state.userReducer)
const [tempLead, setTempLead] = React.useState()


React.useEffect(() => {
    dispatch(fetchInstitution(urlId))
    if (userData.lvl==='admin' || userData.lvl === 'region') {
     setAccess(true)
    }
}, [dispatch, urlId, userData.lvl])


const editHandler = () => {
  if (edit === false) {
    setEdit(true)
    pageData._guideFields && dispatch(fetchSelects(pageData._guideFields.district.fromId))
  } else {
    setEdit(false)
  }
}

const onSelectHandler = (val) => {
  setTempLead(val)
}

const deleteHandler = () => {
  axios.get(`/institution/del/${urlId}`, {
    headers: {
      Accept: "text/json",
    },
  }).then(alert('Успешно удалено'))
}

const onFinish = (values) => {
  dispatch(editInstitution(values, urlId, tempLead))
  setEdit(false)
};

  return (
    <section className="home">
      <h1>КАРТА УЧРЕЖДЕНИЯ</h1> 

      <Button onClick={editHandler}><EditOutlined/>Редактировать</Button>
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
      <EditableText descr='Полное наименование' text={pageData.fullName} access={edit} fieldName='fullName' required={true} errMsg='Заполните поле' />
      <EditableText descr='Краткое наименование' text={pageData.name} access={edit} fieldName='name' required={true} errMsg='Заполните поле' />
      <EditableText descr='Адрес' text={pageData.address} access={edit} fieldName='address' />
      <EditableSelect descr='Район' text={pageData.district.name} access={edit} selectArray={pageData.districtsArr} fieldName='district' />

      {edit ? <Form.Item fieldName="lead"> 
                <div className="editable"><div className="pair"><div className="pair__descr">Руководитель</div><div className="pair__value"></div></div>
                    <AsyncSelect type='institution/loadUsers/leads' onSelectHandler={onSelectHandler}/>
                </div>
      </Form.Item> : <div class="editable"><div class="pair"><div class="pair__descr">Руководитель</div><div class="pair__value">{pageData.lead && pageData.lead.fio}</div></div></div>} 

      <PairLink descr='Список детей, прикрепленных к организации' link={`/childrenbyinst/${urlId}`} text='Перейти' />
      <PairLink descr='Список специалистов организации' link={`/specsbyinst/${urlId}`} text='Перейти' />
      <EditableSelect descr='Оператор организации' text={pageData.operator.fio} access={edit} selectArray={pageData.operatorsArr} fieldName='operator'/>
      <EditableText descr='Номер приказа о назначении' text={pageData.orderNum} access={edit} fieldName='orderNum' />
      <EditableDate descr='Дата приказа о назначении' day={moment(pageData.orderDate).format('YYYY-MM-DD').toString()} access={edit} fieldName='orderDate' />
      <EditableCheckbox descr='Обязательство о неразглашении'  access={edit} fieldName='silence'  initialBoolean={pageData.silence}/>
      {edit && <Button  type="primary" htmlType="submit">Сохранить изменения</Button>}
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
    {access && <Button onClick={deleteHandler}>Удалить</Button>}

    
      
      
    </section>
  );
}

export default Home;
