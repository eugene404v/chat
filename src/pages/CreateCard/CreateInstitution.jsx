import React from "react";
import { Form, Button, Table, Spin } from "antd";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios'
import { useHistory } from "react-router";
import {
  EditableText,
  EditableDate,
  EditableSelect,
  EditableCheckbox,
  AsyncSelect
} from "components";
import { addInstitution, fetchSelects } from "redux/reducers/institution";


function CreateInstitution() {
  const history = useHistory()
  const [access, setAccess] = React.useState(true);
  const dispatch = useDispatch();
  const pageData = useSelector((state) => state.institutionReducer);
  const [tempLead, setTempLead] = React.useState()

  const onFinish = data => {
    var formdata = new FormData();
  let key
  for (key in data){
    if (key != "orderDate") {
      formdata.append(key, data[key]);
    } else if (key == "orderDate") {
      formdata.append(key, moment(data[key]).format("YYYY-MM-DD").toString());
    } 
  }
  formdata.append('lead', tempLead)
  console.log(formdata.get('address'))
  axios.post(`/institution/add`,formdata, {
      headers: {
        Accept: "text/json",
        'Content-Type': 'multipart/form-data'
      },
    })
    .then(function (response) {
      if (response.data.success === true) {
        history.push(`/institution/view/${response.data.object.id}`)
      } else {
        alert(response.data.info)
      }
    });
  };

  React.useEffect(()=> {
    dispatch(fetchSelects(18))
  }, [dispatch])

  const onSelectHandler = (val) => {
    setTempLead(val)
  }

  

  return (
    <div>
      <h1>СОЗДАТЬ КАРТУ УЧРЕЖДЕНИЯ</h1>
      {pageData.isLoaded ? <Form
        dependencies={[pageData]}
        onFinish={onFinish}
        initialValues={{
          fullName: "",
          name: "",
          address: "",
          district: "",
          lead: "",
          operator: "",
          orderNum: "",
          orderDate: "",
          silence: "",
        }}
      >
        <EditableText
          descr="Полное наименование"
          text=""
          access={access}
          fieldName="fullName"
          placeholder='Полное наименование'
          required={true} errMsg='Заполните поле'
        />
        <EditableText
          descr="Краткое наименование"
          text=""
          access={access}
          fieldName="name"
          placeholder='Краткое наименование'
          required={true} errMsg='Заполните поле'
        />
        <EditableText
          descr="Адрес"
          text=""
          access={access}
          fieldName="address"
          placeholder='Укажите Адрес'
        />
        <EditableSelect
          descr="Район"
          text=""
          access={access}
          selectArray={pageData.districtsArr}
          fieldName="district"
          placeholder='Укажите район'
        />
        <Form.Item fieldName="lead"> 
                <div className="editable"><div className="pair"><div className="pair__descr">Руководитель</div><div className="pair__value"></div></div>
                    <AsyncSelect type='institution/loadUsers/leads' onSelectHandler={onSelectHandler}/>
                </div>
        </Form.Item> 
        <h4>Добавить оператора</h4>
        <EditableText
          descr="Логин"
          text=""
          access={access}
          fieldName="name"
          placeholder='Логин'
        />
        <EditableText
          descr="Пароль"
          text=""
          access={access}
          fieldName="password"
          placeholder='Пароль'
        />
        <EditableText
          descr="Повторите пароль"
          text=""
          access={access}
          fieldName="password_confirm"
          placeholder='Повторите пароль'
        />
        <EditableText
          descr="Почта"
          text=""
          access={access}
          fieldName="email"
          placeholder='Почта'
        />
        <EditableText
          descr="Фамилия"
          text=""
          access={access}
          fieldName="firstName"
          placeholder='Фамилия'
        />
        <EditableText
          descr="Имя"
          text=""
          access={access}
          fieldName="lastName"
          placeholder='Имя'
        />
        <EditableText
          descr="Отчество"
          text=""
          access={access}
          fieldName="middleName"
          placeholder='Отчество'
        />
        <EditableSelect
          descr="Оператор организации"
          text=""
          access={access}
          selectArray={pageData.operatorsArr}
          fieldName="operator"
          placeholder='Укажите оператора'
        />
        <EditableText
          descr="Номер приказа о назначении"
          text=""
          access={access}
          fieldName="orderNum"
          placeholder='Номер приказа о назначении'
        />
        <EditableDate
          descr="Дата приказа о назначении"
          day={moment().format("YYYY-MM-DD").toString()}
          access={access}
          fieldName="orderDate"
          placeholder='Дата приказа о назначении'
        />
        <EditableCheckbox
          descr="Обязательство о неразглашении"
          text=""
          access={access}
          fieldName="silence"
          placeholder='Обязательство о неразглашении'
        />
        {access && (
          <Button type="primary" htmlType="submit">
            Сохранить изменения
          </Button>
        )}
      </Form> : <Spin size='large'/>}
    </div>
  );
}

export default CreateInstitution;
