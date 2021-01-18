import React from "react";
import { Form, Button, Table } from "antd";
import moment from "moment";
import axios from 'axios'
import { useSelector, useDispatch } from "react-redux";
import {
  refreshChild,
  addChild,
  fetchSelects,
  fetchInstSelects
} from "redux/reducers/childReducer";

import {
  AsyncSelect,
  EditableText,
  EditableDate,
  EditableSelect,
  EditableCheckbox,
  EditableCheckboxSelect,
} from "components";
import { useHistory } from "react-router";
import { setDistr } from "redux/reducers/reportsReducer";

function CreateChild() {
  const history = useHistory()
  const [access, setAccess] = React.useState(true);
  const [inst, setInst] =  React.useState();
  const dispatch = useDispatch();
  const childData = useSelector((state) => state.childReducer);
  const [distr, setDistr] = React.useState()
  const [instArr, setInstArr] = React.useState()

  React.useEffect(() => {
    dispatch(refreshChild());
    dispatch(fetchSelects(18, 19, 23));
  }, [dispatch]);

const onSelectHandler = (val) => {
  setInst(val)
}

const distrHandler = (val) => {
  setDistr(val)
}

const loadInstHandler = () => {
  axios.get(`/institution/search?search_by=district&search=${distr}`, {
    headers: {
        Accept: 'text/json'
    }}).then(resp=>setInstArr(resp.data.data))
}


  const onFinish = (data) => {
    const formData = {};
    var formdata = new FormData();
    let key;
    for (key in data) {
      if (key != "birthDate" && key != "documentIssuedDate") {
        formdata.append(key, data[key]);
      } else if (key == "birthDate" || key == "documentIssuedDate") {
        formdata.append(key, moment(data[key]).format("YYYY-MM-DD").toString());
      }
      if (data[key] === true) {
        formdata.append(key, 1);
      } else if (data[key] === false) {
        formdata.append(key, 0);
      }
      if (key === "asylumBoolean" && data[key] == false) {
        formdata.append("asylum", 0);
      }
    }
    formdata.append('institution', inst)
    axios
      .post(`/children/add`, formdata, {
        headers: {
          Accept: "text/json",
          "Content-Type": "multipart/form-data",
        },
      })
      .then(function (response) {
        if (response.data.success === true) {
          history.push(`/children/view/${response.data.object.id}`)
        } else {
          alert(response.data.info)
        }
      });
  };

  return (
    <div>
      <h1>СОЗДАТЬ КАРТУ РЕБЕНКА</h1>
      {childData.isLoaded && (
        <Form
          onFinish={onFinish}
          initialValues={{
            last_name: '',
               first_name: '',
               middle_name: '',
            birthDate: "",
            addressReg: "",
            addressFact: "",
            documentIssuedBy: "",
            documentIssuedDate: "",
            documentNumber: "",
            documentType: "",
            district: "",
            institution: "",

            disability: false,
            invalid: false,
            alcoholism: false,
            smoking: false,
            drugs: false,
            other: false,
            asylum: "",
            asylumBoolean: false,
          }}
        >
          <EditableText descr='Фамилия' text='' access={access} fieldName='last_name' required={true} errMsg='Заполните поле'/>
            <EditableText descr='Имя' text='' access={access} fieldName='first_name' required={true} errMsg='Заполните поле'/>
            <EditableText descr='Отчество' text='' access={access} fieldName='middle_name' required={true} errMsg='Заполните поле'/>
          <EditableDate
            descr="Дата рождения"
            day=""
            access={access}
            fieldName="birthDate"
            required={true}
          />

          <EditableSelect
            descr="Район"
            text=""
            access={access}
            selectArray={childData.districtsArr}
            onSelect={distrHandler}
            fieldName="district"
          />
          <EditableSelect
            disabled={!distr}
            descr="Организация"
            text=""
            access={access}
            onFocus={loadInstHandler}
            selectArray={instArr}
            fieldName="institution" 
          />
          {/*<Form.Item fieldName="institution"> 
            <div className="editable"><div className="pair"><div className="pair__descr">Организация</div><div className="pair__value"></div></div>
              <AsyncSelect type='institution' onSelectHandler={onSelectHandler}/>
            </div>
          </Form.Item>*/}

          <EditableText
            descr="Адрес регистрации"
            text=""
            access={access}
            fieldName="addressReg"
          />
          <EditableText
            descr="Адрес фактического проживания"
            text=""
            access={access}
            fieldName="addressFact"
          />
          <EditableSelect
            descr="Тип документа"
            text=""
            access={access}
            selectArray={childData.docTypesArr}
            fieldName="documentType"
          />
          <EditableText
            descr="Документ выдан"
            text=""
            access={access}
            fieldName="documentIssuedBy"
          />
          <EditableText
            descr="Номер и серия документа"
            text=""
            access={access}
            fieldName="documentNumber"
          />
          <EditableDate
            descr="Дата выдачи документа"
            day=""
            access={access}
            fieldName="documentIssuedDate"
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
            text=""
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
