import React from "react";
import {Form, Button, Table} from 'antd'
import moment from 'moment';
import {useParams} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {fetchFamily, refreshFamily, editFamily} from 'redux/reducers/familyReducer'
import axios from 'axios'

import {EditableText, EditableDate, EditableSelect, PairLink, Pair, EditableCheckbox, EditableCheckboxSelect, PairInputBtn} from "components";
import FamilyMatesTable from "./FamilyMatesTable";
import FamilySopTable from "./FamilySopTable";
import FamilyMprTable from "./FamilyMprTable";
import FamilyIndividualTable from "./FamilyIndividualTable";
import FamilyForm from "./FamilyForm";
import FamilyActTable from "./FamilyActTable";


function Family() {
    const urlId = useParams().id
    const [access, setAccess] = React.useState(false)
    const dispatch = useDispatch()
    const familyData = useSelector(state => state.familyReducer)

    React.useEffect(() => {
        dispatch(refreshFamily())
        dispatch(fetchFamily(urlId))
    }, [dispatch, urlId])
    
    const accessHandler = () => {
      if (access === false) {
        setAccess(true)
      } else {
        setAccess(false)
      }
    }
    
    const archiveHandler = (data) => {
      var formdata = new FormData();
      let key;
      for (key in data) {
     
      formdata.append(key, data[key]);
    
  }
      axios.post(`/archiving/requestToArchive/37/${urlId}`, formdata,  {
        headers: {
          Accept: "text/json",
          "Content-Type": "multipart/form-data",
        },
      })
      .then(response => {
        if (response.data.success === true) {
          alert('Запрос на архивацию успешно отправлен')
        }
      })
    }
    
    const onFinish = values => {

      dispatch(editFamily(values, urlId, familyData.familyType))
    };

    return (
        <section>
            <h1>КАРТА СЕМЬИ</h1>
            <h2>Совместно проживающие члены семьи</h2>
            <FamilyMatesTable data={familyData.familyMates} urlId={urlId}/>
            <h2>Дополнительные сведения о семье</h2>
            <Button onClick={accessHandler}>change access</Button>
            {familyData.isLoaded && <FamilyForm onFinish={onFinish} data={familyData} access={access} />}
            <h2>Сведения из БД СОП</h2>
            <FamilySopTable data={familyData.familySop} />
            <h2>Сведения об утверждении МПР</h2>
            <FamilyMprTable data={familyData.familyMpr} />
            <h2>Жилищно-бытовые условия проживания семьи</h2>
            <p>АКТ</p>
            <FamilyActTable data={familyData.familyActs}  />
            <h2>План индивидуальной профилактической работы (МПР семья)</h2>
            <a href={`/family/exportPlans/${urlId}`} download>EXCEL</a>
            <FamilyIndividualTable data={familyData.familyIndividual} />
            <PairInputBtn onFinish={archiveHandler} fieldName='descr' descr='Запрос на архивацию карты' placeholder='Разъясните причину' submitText='Отправить запрос' />
        </section>
    )
}

export default Family
