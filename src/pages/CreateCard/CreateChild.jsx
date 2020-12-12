import React from "react";
import { Form, Button, Table } from "antd";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import {
  refreshChild,
  addChild,
  fetchSelects,
} from "redux/reducers/childReducer";

import {
  EditableText,
  EditableDate,
  EditableSelect,
  EditableCheckbox,
  EditableCheckboxSelect,
} from "components";

function CreateChild() {
  const [access, setAccess] = React.useState(true);
  const dispatch = useDispatch();
  const childData = useSelector((state) => state.childReducer);

  React.useEffect(() => {
    dispatch(refreshChild());
    dispatch(fetchSelects(9, 18, 19, 23));
  }, [dispatch]);

  const onFinish = (values) => {
    dispatch(addChild(values));
  };

  return (
    <div>
      <h1>СОЗДАТЬ КАРТУ РЕБЕНКА</h1>
      {childData.isLoaded && (
        <Form
          onFinish={onFinish}
          initialValues={{
            name: '',
            birthDate: '',
            addressReg: '',
            addressFact: '',
            documentIssuedBy: '',
            documentIssuedDate: '',
            documentNumber: '',
            documentType: '',
            district: '',
            institution: '',

            disability: false,
            invalid: false,
            alcoholism: false,
            smoking: false,
            drugs: false,
            other: false,
            asylum: '',
          }}
        >
          <EditableText
            descr="ФИО"
            text={childData.name}
            access={access}
            fieldName="name"
          />
          <EditableDate
            descr="Дата рождения"
            day=''
            access={access}
            fieldName="birthDate"
          />
          <EditableSelect
            descr="Организация"
            text=''
            access={access}
            selectArray={childData.institutionsArr}
            fieldName="institution"
          />
          <EditableText
            descr="Адрес регистрации"
            text=''
            access={access}
            fieldName="addressReg"
          />
          <EditableText
            descr="Адрес фактического проживания"
            text=''
            access={access}
            fieldName="addressFact"
          />
          <EditableSelect
            descr="Тип документа"
            text=''
            access={access}
            selectArray={childData.docTypesArr}
            fieldName="documentType"
          />
          <EditableText
            descr="Документ выдан"
            text=''
            access={access}
            fieldName="documentIssuedBy"
          />
          <EditableText
            descr="Номер и серия документа"
            text=''
            access={access}
            fieldName="documentNumber"
          />
          <EditableDate
            descr="Дата выдачи документа"
            day=''
            access={access}
            fieldName="birthDate"
          />
          <EditableSelect
            descr="Район"
            text=''
            access={access}
            selectArray={childData.districtsArr}
            fieldName="district"
          />

          <EditableCheckbox
            descr="Ограниченные возможности здоровья"
            initialBoolean={false}
            access={access}
            fieldName="disability"
          />
          <EditableCheckbox
            descr="Инвалидность"
            initialBoolean={false}
            access={access}
            fieldName="invalid"
          />
          <EditableCheckbox
            descr="Алкогольная зависимость"
            initialBoolean={false}
            access={access}
            fieldName="alcoholism"
          />
          <EditableCheckbox
            descr="Табачная зависимость"
            initialBoolean={false}
            access={access}
            fieldName="smoking"
          />
          <EditableCheckbox
            descr="Наркотическая зависимость"
            initialBoolean={false}
            access={access}
            fieldName="drugs"
          />
          <EditableCheckbox
            descr="Иная зависимость"
            initialBoolean={false}
            access={access}
            fieldName="other"
          />

          <EditableCheckboxSelect
            descr="Проживает в учреждении для детей-сирот и детей, оставшихся без попечения родителей"
            initialBoolean={false}
            access={access}
            fieldName="asylum"
            selectArray={childData.asylumsArr}
            text=''
          />
          {access && (
            <Button type="primary" htmlType="submit">
              Сохранить изменения
            </Button>
          )}
        </Form>
      )}
    </div>
  );
}

export default CreateChild;
