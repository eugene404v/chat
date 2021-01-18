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
import { useHistory } from "react-router";
import axios from 'axios'
import {
  EditableText,
  EditableDate,
  EditableSelect,
  PairLink,
  EditableCheckbox,
} from "components";

function CreateParent() {
  const history = useHistory()
  const [edit, setEdit] = React.useState(true);
  const dispatch = useDispatch();
  const parentData = useSelector((state) => state.parentReducer);

  React.useEffect(() => {
    dispatch(refreshParent());
    dispatch(fetchSelects(19, 18));
  }, [dispatch]);

  const onFinish = (data) => {
    var formdata = new FormData();
  let key;
  for (key in data) {
    if (key != "birthDate" && key != "documentIssuedDate") {
      formdata.append(key, data[key]);
    } else if (key == "birthDate" || key == "documentIssuedDate") {
      formdata.append(key, moment(data[key]).format("YYYY-MM-DD").toString());
    } 
    if (data[key]===true) {
      formdata.append(key, 1);
    } else if (data[key]===false) {
      formdata.append(key, 0);
    }
  }
  axios
    .post(`/parents/add`, formdata, {
      headers: {
        Accept: "text/json",
        "Content-Type": "multipart/form-data",
      },
    })
    .then(function (response) {
      if (response.data.success === true) {
        history.push(`/parents/view/${response.data.object.id}`)
      } else {
        alert(response.data.info)
      }
    });
  };

  return (
    <div>
      <h1>СОЗДАТЬ КАРТУ РОДИТЕЛЯ</h1>
      {parentData.isLoaded && (
        <Form
          onFinish={onFinish}
          initialValues={{
            last_name: '',
            first_name: '',
            middle_name: '',
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
          <EditableText descr='Фамилия' text='' access={edit} fieldName='last_name' required={true} errMsg='Заполните поле'/>
            <EditableText descr='Имя' text='' access={edit} fieldName='first_name' required={true} errMsg='Заполните поле'/>
            <EditableText descr='Отчество' text='' access={edit} fieldName='middle_name' required={true} errMsg='Заполните поле'/>
          <EditableDate
            descr="Дата рождения"
            day=''
            access={edit}
            fieldName="birthDate"
            required={true}
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
