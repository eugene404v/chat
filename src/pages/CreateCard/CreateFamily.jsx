import React from 'react'
import {Form, Button} from 'antd'
import {useSelector, useDispatch} from 'react-redux'
import { refreshFamily, addFamily} from 'redux/reducers/familyReducer'
import {EditableText, EditableDate, EditableSelect, PairLink, Pair, EditableCheckbox, EditableCheckboxSelect, PairInputBtn} from "components";
import axios from 'axios'
import { useHistory } from "react-router";

function CreateFamily() {
    const history = useHistory()
    const [access, setAccess] = React.useState(true);
    const dispatch = useDispatch();
    const familyData = useSelector(state => state.familyReducer)

    const onFinish = data => {
            const formData = {};
            var formdata = new FormData();
            let key;
            for (key in data) {
              if (data[key] === true) {
                formdata.append(key, 1);
              } else if (data[key] === false) {
                formdata.append(key, 0);
              } else {
                formdata.append(key, data[key]);
              }
            }
            axios
              .post(`/family/add`, formdata, {
                headers: {
                  Accept: "text/json",
                  "Content-Type": "multipart/form-data",
                },
              })
              .then(function (response) {
                if (response.data.success === true) {
                    history.push(`/family/view/${response.data.object.id}`)
                  } else {
                    alert(response.data.info)
                  }
              });
    };

    return (
        <Form  onFinish={onFinish} initialValues={{ 
            manyChildren: 0,
            alcoholism: 0,
            drugs: 0,
            familyType: '',
            familyFeatures: ''
            }} >
            

            <EditableCheckbox descr='Многодетная' initialBoolean={false} access={access} fieldName='manyChildren'/>
            <EditableCheckbox descr='Родители злоупотребляют алкоголем' initialBoolean={false} access={access} fieldName='alcoholism'/>
            <EditableCheckbox descr='Родители злоупотребляют ПАВ' initialBoolean={false} access={access} fieldName='drugs'/>
            <EditableSelect descr='Вид семьи' text='' access={access} selectArray={familyData.familyTypesArr} fieldName='familyType' />
            <EditableSelect descr='Особенности семьи' text='' access={access} selectArray={familyData.familyFeaturesArr} fieldName='familyFeatures' />
            {access && <Button  type="primary" htmlType="submit">Сохранить изменения</Button>}
        </Form>
    )
}

export default CreateFamily


