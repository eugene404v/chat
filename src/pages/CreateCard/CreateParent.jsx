import React from "react";
import { Form, Button, Table } from "antd";
import moment from "moment";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  refreshParent,
  addParent,
  fetchSelects,
} from "redux/reducers/parentReducer";

import {
  EditableText,
  EditableDate,
  EditableSelect,
  PairLink,
  EditableCheckbox,
} from "components";

function CreateParent() {
  const [edit, setEdit] = React.useState(true);
  const dispatch = useDispatch();
  const parentData = useSelector((state) => state.parentReducer);

  React.useEffect(() => {
    dispatch(refreshParent());
    dispatch(fetchSelects(19, 18));
  }, [dispatch]);

  const onFinish = (values) => {
    dispatch(addParent(values));
  };

  return (
    <div>
      <h1>СОЗДАТЬ КАРТУ РОДИТЕЛЯ</h1>
      {parentData.isLoaded && (
        <Form
          onFinish={onFinish}
          initialValues={{
            name: '',
            birthDate: '',
            addressReg: '',
            addressFact: '',
            work: '',
            documentType: '',
            documentIssuedBy: '',
            documentNumber: '',
            documentIssuedDate: '',
            district:'',
            alcoholism: false,
            drugs: false,
            lowerRights: false,
            deprivedRights: false,
            solitude: false,
            prison: false,
          }}
        >
          <EditableText
            descr="ФИО"
            text=''
            access={edit}
            fieldName="name"
          />
          <EditableDate
            descr="Дата рождения"
            day=''
            access={edit}
            fieldName="birthDate"
          />
          <EditableText
            descr="Занятость"
            text=''
            access={edit}
            fieldName="work"
          />
          <EditableText
            descr="Адрес регистрации"
            text=''
            access={edit}
            fieldName="addressReg"
          />
          <EditableText
            descr="Адрес фактического проживания"
            text=''
            access={edit}
            fieldName="addressFact"
          />

          <EditableSelect
            descr="Документ удостоверяющий личность"
            text=''
            access={edit}
            selectArray={parentData.docsArr}
            fieldName="documentType"
          />
          <EditableText
            descr="Документ выдан"
            text=''
            access={edit}
            fieldName="documentIssuedBy"
          />
          <EditableText
            descr="Номер и серия документа"
            text=''
            access={edit}
            fieldName="documentNumber"
          />
          <EditableDate
            descr="Дата выдачи документа"
            day=''
            access={edit}
            fieldName="documentIssuedDate"
          />

          <EditableSelect
            descr="Район"
            text=''
            access={edit}
            selectArray={parentData.districtsArr}
            fieldName="district"
          />
          <EditableCheckbox
            descr="Злоупотребляет алкоголем"
            initialBoolean={false}
            access={edit}
            fieldName="alcoholism"
          />
          <EditableCheckbox
            descr="Злоупотребляет ПАВ"
            initialBoolean={false}
            access={edit}
            fieldName="drugs"
          />
          <EditableCheckbox
            descr="Ограниченные в правах"
            initialBoolean={false}
            access={edit}
            fieldName="lowerRights"
          />
          <EditableCheckbox
            descr="Лишен родительских прав"
            initialBoolean={false}
            access={edit}
            fieldName="deprivedRights"
          />
          <EditableCheckbox
            descr="Проживает отдельно"
            initialBoolean={false}
            access={edit}
            fieldName="solitude"
          />
          <EditableCheckbox
            descr="Судимость"
            initialBoolean={false}
            access={edit}
            fieldName="prison"
          />
          {edit && (
            <Button type="primary" htmlType="submit">
              Сохранить изменения
            </Button>
          )}
        </Form>
      )}
    </div>
  );
}

export default CreateParent;
