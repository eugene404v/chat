import React from 'react'
import {Form, Button} from 'antd'
import {useSelector, useDispatch} from 'react-redux'
import { refreshFamily, addFamily} from 'redux/reducers/familyReducer'
import {EditableText, EditableDate, EditableSelect, PairLink, Pair, EditableCheckbox, EditableCheckboxSelect, PairInputBtn} from "components";

function CreateFamily() {
    const [access, setAccess] = React.useState(true);
    const dispatch = useDispatch();
    const familyData = useSelector(state => state.familyReducer)

    const onFinish = values => {
        dispatch(addFamily(values))
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


