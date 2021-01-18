import React from 'react'
import {Form, Button} from 'antd'
import {useSelector} from 'react-redux'


import {EditableCheckbox, EditableSelect, PairInputBtn} from "components";

function FamilyForm({onFinish, data, access}) { //форма дополнительной информации о семье
    const famData = useSelector(state => state.familyReducer)
    return (
        <Form  onFinish={onFinish} initialValues={{ 
            manyChildren: !!data.manyChildren,
            alcoholism: !!data.alcoholism,
            drugs: !!data.drugs,
            familyType: data.familyType && data.familyType.id,
            familyFeatures: data.familyFeatures && data.familyFeatures.id
            }} >
            

            <EditableCheckbox descr='Многодетная' initialBoolean={!!data.manyChildren} access={access} fieldName='manyChildren'/>
            <EditableCheckbox descr='Родители злоупотребляют алкоголем' initialBoolean={!!data.alcoholism} access={access} fieldName='alcoholism'/>
            <EditableCheckbox descr='Родители злоупотребляют ПАВ' initialBoolean={!!data.drugs} access={access} fieldName='drugs'/>
            <EditableSelect descr='Вид семьи' text={data.familyType.name} access={access} selectArray={famData.familyTypesArr} fieldName='familyType' />
            <EditableSelect descr='Особенности семьи' text={data.familyFeatures && data.familyFeatures.name} access={access} selectArray={famData.familyFeaturesArr} fieldName='familyFeatures' />
            {access && <Button  type="primary" htmlType="submit">Сохранить изменения</Button>}
        </Form>
    )
}

export default FamilyForm
