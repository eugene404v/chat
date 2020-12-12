import React from "react";
import { Form, Button, Table, Spin } from "antd";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";

import {
  EditableText,
  EditableDate,
  EditableSelect
} from "components";
import { addInstitution, fetchSelects } from "redux/reducers/institution";


function CreateInstitution() {
  const [access, setAccess] = React.useState(true);
  const dispatch = useDispatch();
  const pageData = useSelector((state) => state.institutionReducer);

  const onFinish = values => {
    dispatch(addInstitution(values))
  };

  React.useEffect(()=> {
    dispatch(fetchSelects(18))
  }, [dispatch])

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
        />
        <EditableText
          descr="Краткое наименование"
          text=""
          access={access}
          fieldName="name"
          placeholder='Краткое наименование'
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
        <EditableSelect
          descr="Руководитель"
          text=""
          access={access}
          selectArray={pageData.leadsArr}
          fieldName="lead"
          placeholder='Укажите руководителя'
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
        <EditableText
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
