import React from "react";
import { EditableCell, EditableRowTrigger } from "components";
import {useSelector, useDispatch} from 'react-redux'
import {refreshFamily, fetchFamily} from 'redux/reducers/familyReducer'
import {Alert, Upload, message, Button, Checkbox, InputNumber, Input, Select   } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import axios from 'axios'
import { DeleteOutlined, PlusSquareOutlined   } from "@ant-design/icons";


const EditableRow = (props) => { // редактируемая строка таблицы
  const famData = useSelector(state => state.familyReducer)
  const dispatch = useDispatch()
    const [edit, setEdit] = React.useState(false)
    const [dateViewed, setDateViewed] = React.useState(props.dateViewed)
    const [dateWrited, setDateWrited] = React.useState(props.dateWrited)
    const [source, setSource] = React.useState(props.source)
    const [addressFact, setAddressFact] = React.useState(props.addressFact)
    const [addressReg, setAddressReg] = React.useState(props.addressReg)
    const [exists, setExists] = React.useState(true)
    
    const dateViewedHandler = (_, dateString) => {
        setDateViewed(dateString)
    }

    const dateWritedHandler = (_, dateString) => {
        setDateWrited(dateString)
    }

    const sourceHandler = (e) => {
        setSource(e.target.value)
    }

    const addressFactHandler = (e) => {
        setAddressFact(e.target.value)
    }
  
    const addressRegHandler = (e) => {
        setAddressReg(e.target.value)
    }

    const editHandler = () => {
      //famData._guideFields && dispatch(fetchFamilyIndividualIds(famData._guideFields.familyIndividual.fromId))
      setEdit(true)
    }
    
    const cancelHandler = () => {
      setEdit(false)
    }
  
    const saveHandler = () => {
      const stateData = {
        dateViewed, dateWrited, source, addressFact, addressReg   
      }
      const formData = {}
    var formdata = new FormData();
    let key
    for (key in stateData){
        formdata.append(key, stateData[key])
    }
    axios.post(`/family/editExtendedInFamily/familyActs/${props.id}/${props.childId}`,formdata, { //????????????????????????????????????????????????????????????????????????????
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': "text/json"
      },
    })
    .then(function (response) {
      setEdit(false)
    })
    }
  
    const deleteHandler = (id) => {
      setExists(false)
      axios.post(`/family/delExtendFromFamily/familyActs/${props.id}/${props.childId}`, {}, {headers: { 
        Accept: "text/json"
      }})
    }
  
    return (
        exists && <tr index={props.id} display="table-row">
          <EditableCell day="true" editing={edit} onDateChange={dateWritedHandler}>{dateWrited}</EditableCell>
          <EditableCell input="true" editing={edit} onInputChange={sourceHandler}>{source}</EditableCell>
          <EditableCell day="true" editing={edit} onDateChange={dateViewedHandler}>{dateViewed}</EditableCell>
          <EditableCell input="true" editing={edit} onInputChange={addressRegHandler}>{addressReg}</EditableCell>
          <EditableCell input="true" editing={edit} onInputChange={addressFactHandler}>{addressFact}</EditableCell>
          <td><a href={`${props.file}`} download>Скачать</a></td>
          {/*props.access && <EditableRowTrigger editing={edit} onedit={editHandler} onCancel={cancelHandler} onSave={saveHandler}/>}
          {props.access && <td><Button onClick={()=>deleteHandler(props.parentId)}><DeleteOutlined /></Button></td>*/}
        </tr>
    );
  };

function FamilyActTable(props) { // компонент таблицы
  const dispatch = useDispatch()
  const famData = useSelector(state => state.familyReducer)
  const [adding, setAdding] = React.useState(false)
  const [children, setChildren] = React.useState()
  const [parents, setParents] = React.useState()
  const [familyTypesArr, setFamilyTypesArr] = React.useState()

  React.useEffect(() => {
    famData && Array.isArray(famData.familyMates) && setChildren(famData.familyMates.filter(el => el.childId && el.childId > 0))
    famData && Array.isArray(famData.familyMates) && setParents(famData.familyMates.filter(el => el.parentId && el.parentId > 0))
    axios
    .get(`/guides/list_items/56/0/0/0/0/1`, {
      headers: {
        Accept: "text/json",
      },
    })
    .then(function (response) {
      setFamilyTypesArr(response.data.data);
    });
  }, [famData.familyMates])

  const addHandler = () => {
    

      setAdding(true)
  }

  const NewRow = (props) => { // новая строка таблицы
    const [error, setError] = React.useState(false)
    const [dateViewed, setDateViewed] = React.useState()
    const [dateWrited, setDateWrited] = React.useState()
    const [source, setSource] = React.useState()
    const [addressFact, setAddressFact] = React.useState(Array.isArray(children) && children[0] && children[0].child_member && children[0].child_member.addressFact)
    const [addressReg, setAddressReg] = React.useState(Array.isArray(children) && children[0] && children[0].child_member && children[0].child_member.addressReg)

    const [familyTypes, setFamilyTypes] = React.useState()
    const [flat, setFlat] = React.useState()
    const [flatNum, setFlatNum] = React.useState()
    const [houseSquare, setHouseSquare] = React.useState()
    const [flatOther, setFlatOther] = React.useState()
    const [sanitar, setSanitar] = React.useState()
    const [material, setMaterial] = React.useState()
    const [ownRoom, setOwnRoom] = React.useState()
    const [table, setTable] = React.useState()

    const [besprizor, setBesprizor] = React.useState()
    const [besprizorList, setBesprizorList] = React.useState()
    const [beznadzor, setBeznadzor] = React.useState()
    const [beznadzorList, setBeznadzorList] = React.useState()
    const [crimes, setCrimes] = React.useState()
    const [crimesList, setCrimesList] = React.useState()
    const [alco, setAlco] = React.useState()
    const [alcoList, setAlcoList] = React.useState()
    const [drugs, setDrugs] = React.useState()
    const [drugsList, setDrugsList] = React.useState()
    const [antisocial, setAntisocial] = React.useState()
    const [antisocialList, setAntisocialList] = React.useState()
    const [parentNot, setParentNot] = React.useState()
    const [parentNotList, setParentNotList] = React.useState()
    const [negative, setNegative] = React.useState()
    const [negativeList, setNegativeList] = React.useState()
    const [cruel, setCruel] = React.useState()
    const [cruelList, setCruelList] = React.useState()
    const [alcoDrugs, setAlcoDrugs] = React.useState()
    const [alcoDrugsList, setAlcoDrugsList] = React.useState()
    const [notWork, setNotWork] = React.useState()
    const [notWorkList, setNotWorkList] = React.useState()

    const [otherInfo, setOtherInfo] = React.useState()
    const [influence, setInfluence] = React.useState()
    const [note, setNote] = React.useState()
    const [specialist, setSpecialist] = React.useState()
    const [lead, setLead] = React.useState()
    const [conclusion, setConclusion] = React.useState()

    const dateViewedHandler = (_, dateString) => {
        setDateViewed(dateString)
    }

    const dateWritedHandler = (_, dateString) => {
        setDateWrited(dateString)
    }

  
    const sourceHandler = (e) => {
        setSource(e.target.value)
    }

    const addressFactHandler = (e) => {
        setAddressFact(e.target.value)
    }
  
    const addressRegHandler = (e) => {
        setAddressReg(e.target.value)
    }

    const familyTypeHandler = (v) => {
      setFamilyTypes(v)
    }

    const flatHandler = (e) => {
      setFlat(e.target.value)
    }

    const flatNumHandler = (v) => {
      setFlatNum(v)
    }

    const houseSquareHandler = (v) => {
      setHouseSquare(v)
    }

    const flatOtherHandler = (e) => {
      setFlatOther(e.target.value)
    }
  
   const sanitarHandler = (e) => {
     setSanitar(e.target.value)
   }

   const materialHandler = (e) => {
     setMaterial(e.target.value)
   }

   const ownRoomHandler = (e) => {
     setOwnRoom(e.target.value)
   }

   const tableHandler = (e) => {
     setTable(e.target.value)
   }

   const besprizorHandler = (e) => {
     setBesprizor(e.target.value)
   }

   const besprizorListHandler = (e) => {
    setBesprizorList(e)
  }

  const beznadzorHandler = (e) => {
    setBeznadzor(e.target.value)
  }

  const beznadzorListHandler = (e) => {
    setBeznadzorList(e)
  }

  const crimesHandler = (e) => {
    setCrimes(e.target.value)//
  }

  const crimesListHandler = (e) => {
    setCrimesList(e)
  }

  const alcoHandler = (e) => {
    setAlco(e.target.value)
  }

  const alcoListHandler = (e) => {
    setAlcoList(e)
  }

  const drugsHandler = (e) => {
    setDrugs(e.target.value)
  }

  const drugsListHandler = (e) => {
    setDrugsList(e)
  }

  const antisocialHandler = (e) => {
    setAntisocial(e.target.value)
  }

  const antisocialListHandler = (e) => {
    setAntisocialList(e)
  }
  //
  const parentNotHandler = (e) => {
    setParentNot(e.target.value)
  }

  const parentNotListHandler = (e) => {
    setParentNotList(e)
  }
  const negativeHandler = (e) => {
    setNegative(e.target.value)
  }

  const negativeListHandler = (e) => {
    setNegativeList(e)
  }
  const cruelHandler = (e) => {
    setCruel(e.target.value)
  }

  const cruelListHandler = (e) => {
    setCruelList(e)
  }
  const alcoDrugsHandler = (e) => {
    setAlcoDrugs(e.target.value)
  }

  const alcoDrugsListHandler = (e) => {
    setAlcoDrugsList(e)
  }
  const notWorkHandler = (e) => {
    setNotWork(e.target.value)
  }

  const notWorkListHandler = (e) => {
    setNotWorkList(e)
  }

  const otherInfoHandler = (e) => {
    setOtherInfo(e.target.value)
  }

  const influenceHandler = (e) => {
    setInfluence(e.target.value)
  }

  const specHandler = (e) => {
    setSpecialist(e.target.value)
  }

  const leadHandler = (e) => {
    setLead(e.target.value)
  }

  const noteHandler = (e) => {
    setNote(e.target.value)
  }

  const conclusionHandler = (v) => {
    setConclusion(v)
  }
  
    const saveHandler = () => {
        const stateData = {
            dateViewed, dateWrited, source, addressFact, addressReg, 
            //
            familyTypes, flat, flatRoomCount: flatNum, houseSquare, flatOther, sanitar, material, ownRoom, table, 
            //
            besprizor, besprizorList, beznadzor, beznadzorList, childCrimes:crimes, childCrimesChildren:crimesList, childAlco:alco, childAlcoChildren:alcoList, childDrugs:drugs, childDrugsChildren:drugsList, childAntisocial: antisocial, childAntisocialChildren: antisocialList, parentNotEducate: parentNot, parentNotEducateParents: parentNotList, parentNegative: negative, parentNegativeParents: negativeList, parentCruel: cruel, parentCruelParents: cruelList, parentAlcoDrugs: alcoDrugs, parentAlcoDrugsParents: alcoDrugsList, parentNotWork: notWork, parentNotWorkParents: notWorkList, 
            //
            otherInfo, influenceOnChild: influence, note, specialist, lead, conclusion
        }
      if ((!stateData.dateViewed)||(!stateData.dateWrited)||(!stateData.source)||(!stateData.addressFact)||(!stateData.addressReg)) {
        console.log(stateData)
        setError(true)
      } else {
        dispatch(refreshFamily())
        const formData = {}
        var formdata = new FormData();
        let key
        for (key in stateData){
          if (stateData[key] !== undefined && stateData[key] !== null) {
            formdata.append(key, stateData[key])
          }
            
        }
        axios.post(`/family/addExtendedToFamily/familyActs/${props.id}`,formdata, { 
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': "text/json"
          },
        })
        .then(function (response) { 
          setAdding(false)
          dispatch(fetchFamily(props.id))
        })
      }
    }

    const cancelHandler = () => {
      setAdding(false)
    }


    return (<>
    <tr>
          <EditableCell day="true" editing={adding} onDateChange={dateWritedHandler} placeholder='Дата составления'>{dateWrited}</EditableCell>
          <EditableCell input="true" editing={adding} onInputChange={sourceHandler} placeholder='Источник информации' maxLength={60}>{source}</EditableCell>
          <EditableCell day="true" editing={adding} onDateChange={dateViewedHandler} placeholder='Дата выявления'>{dateViewed}</EditableCell>
          <EditableCell input="true" editing={adding} onInputChange={addressRegHandler} placeholder='Адрес регистрации' maxLength={60}>{addressReg}</EditableCell>
          <EditableCell input="true" editing={adding} onInputChange={addressFactHandler} placeholder='Адрес проживания' maxLength={60}>{addressFact}</EditableCell>
          <td></td>

    </tr>
    <tr>
      <td>Категория семьи</td>
      <td colSpan={5}><Select mode="multiple" onChange={familyTypeHandler} allowClear className='select' placeholder='Выберите тип'>
        {Array.isArray(familyTypesArr) && familyTypesArr.map(el => {
        return <Select.Option key={el.id}>{el.name}</Select.Option>
        })}
        </Select></td>
    </tr>
    <tr><td colSpan={6}>Жилищные условия:</td></tr>
    <tr>
      <td>
        <label><input type="radio" name="flat" value='flat' className='act__checkbox' onChange={flatHandler}/> Квартира</label>
        {flat==='flat' && <InputNumber  placeholder='Количество комнат' className='act__number' onChange={flatNumHandler}/>}
      </td>
      <td><label><input type="radio" name="flat" value='room' className='act__checkbox' onChange={flatHandler}/> Отдельная комната в квартире</label></td>
      <td><label><input type="radio" name="flat" value='communal' className='act__checkbox' onChange={flatHandler}/> Коммунальная квартира</label></td>
      <td><label><input type="radio" name="flat" value='hostel' className='act__checkbox' onChange={flatHandler}/> Общежитие</label></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>
        <label><input type="radio" name="flat" value='house' className='act__checkbox' onChange={flatHandler}/> Частный дом</label>
        {flat==='house' && <InputNumber  placeholder='Площадь дома' className='act__number' onChange={houseSquareHandler}/>}
      </td>
      <td><label><input type="radio" name="flat" value='ruined' className='act__checkbox' onChange={flatHandler}/> Ветхое жилье</label></td>
      <td><label><input type="radio" name="flat" value='homeless' className='act__checkbox' onChange={flatHandler}/> Нет постоянного жилья</label></td>
      <td>
        <label><input type="radio" name="flat" value='other' className='act__checkbox' onChange={flatHandler}/> Другое</label>
        {flat==='other' && <Input placeholder='Другое' onChange={flatOtherHandler} />}
      </td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td colSpan={3}><Input.TextArea placeholder='Санитарное состояние жилья' maxLength={200} onChange={sanitarHandler}/></td>
      <td colSpan={3}><Input.TextArea placeholder='Материальный достаток семьи' maxLength={60} onChange={materialHandler}/></td>
    </tr>
    <tr>
      <td>Условия жизни несовершеннолетнего:</td>
      <td><label><input type="radio" name="ownRoom" value='room' className='act__checkbox' onChange={ownRoomHandler}/> Отдельная комната</label></td> 
      <td><label><input type="radio" name="ownRoom" value='corner' className='act__checkbox' onChange={ownRoomHandler}/> Уголок в общей комнате</label></td>
      <td><label><input type="checkbox" name="table" value={1} className='act__checkbox' onChange={tableHandler}/> Свой письменный стол</label></td>
      {/*<td colSpan={2}><Input placeholder='Другое' maxLength={200} /></td>*/}
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td colSpan={6}>Признаки неблагополучия:</td>
    </tr>
    <tr>
      <td colSpan={1}>Беспризорность несовершеннолетних</td>
      <td><input type="checkbox" name="besprizor" value={1} className='act__checkbox' onChange={besprizorHandler}/></td>
      <td colSpan={3}><Select onChange={besprizorListHandler}mode="multiple" allowClear className='select' placeholder='Укажите детей'>
        {Array.isArray(children) && children.map(el => {
        return <Select.Option key={el.childId}>{el.fio}</Select.Option>
        })}
        </Select></td> 
      <td></td>
    </tr>
    <tr>
      <td colSpan={1}>Безнадзорность несовершеннолетних</td>
      <td><input type="checkbox" name="beznadzor" value={1} className='act__checkbox' onChange={beznadzorHandler}/></td>
      <td colSpan={3}><Select onChange={beznadzorListHandler}mode="multiple" allowClear className='select' placeholder='Укажите детей'>
        {Array.isArray(children) && children.map(el => {
        return <Select.Option key={el.childId}>{el.fio}</Select.Option>
        })}
        </Select></td>
      <td></td>
    </tr>
    <tr>
      <td colSpan={1}>Совершение несовершеннолетними правонарушений</td>
      <td><input type="checkbox" name="childCrimes" value={1} className='act__checkbox' onChange={crimesHandler}/></td>
      <td colSpan={3}><Select onChange={crimesListHandler}mode="multiple" allowClear className='select' placeholder='Укажите детей'>
        {Array.isArray(children) && children.map(el => {
        return <Select.Option key={el.childId}>{el.fio}</Select.Option>
        })}
        </Select></td>
      <td></td>
    </tr>
    <tr>
      <td colSpan={1}>Употребление несовершеннолетними алкогольных напитков</td>
      <td><input type="checkbox" name="childAlco" value={1} className='act__checkbox' onChange={alcoHandler}/></td>
      <td colSpan={3}><Select onChange={alcoListHandler}mode="multiple" allowClear className='select' placeholder='Укажите детей'>
        {Array.isArray(children) && children.map(el => {
        return <Select.Option key={el.childId}>{el.fio}</Select.Option>
        })}
        </Select></td>
      <td></td>
    </tr>
    <tr>
      <td colSpan={1}>Употребление несовершеннолетними психоактивных (за исключением алкогольных напитков) веществ</td>
      <td><input type="checkbox" name="childDrugs" value={1} className='act__checkbox' onChange={drugsHandler}/></td>
      <td colSpan={3}><Select onChange={drugsListHandler}mode="multiple" allowClear className='select' placeholder='Укажите детей'>
        {Array.isArray(children) && children.map(el => {
        return <Select.Option key={el.childId}>{el.fio}</Select.Option>
        })}
        </Select></td>
      <td></td>
    </tr>
    <tr>
      <td colSpan={1}>Совершение несовершеннолетними иных антиобщественных действий</td>
      <td><input type="checkbox" name="childAntisocial" value={1} className='act__checkbox' onChange={antisocialHandler}/></td>
      <td colSpan={3}><Select onChange={antisocialListHandler}mode="multiple" allowClear className='select' placeholder='Укажите детей'>
        {Array.isArray(children) && children.map(el => {
        return <Select.Option key={el.childId}>{el.fio}</Select.Option>
        })}
        </Select></td>
      <td></td>
    </tr>
    <tr>
      <td colSpan={1}>Родители (иные законные представители) несовершеннолетних не исполняют своих обязанностей по их воспитанию, обучению и (или) содержанию</td>
      <td><input type="checkbox" name="parentNotEducate" value={1} className='act__checkbox' onChange={parentNotHandler}/></td>
      <td colSpan={3}><Select onChange={parentNotListHandler}mode="multiple" allowClear className='select' placeholder='Укажите родителей'>
        {Array.isArray(parents) && parents.map(el => {
        return <Select.Option key={el.parentId}>{el.fio}</Select.Option>
        })}
        </Select></td>
      <td></td>
    </tr>
    <tr>
      <td colSpan={1}>Родители (иные законные представители) несовершеннолетних отрицательно влияют на их поведение</td>
      <td><input type="checkbox" name="parentNegative" value={1} className='act__checkbox' onChange={negativeHandler}/></td>
      <td colSpan={3}><Select onChange={negativeListHandler}mode="multiple" allowClear className='select' placeholder='Укажите родителей'>
        {Array.isArray(parents) && parents.map(el => {
        return <Select.Option key={el.parentId}>{el.fio}</Select.Option>
        })}
        </Select></td>
      <td></td>
    </tr>
    <tr>
      <td colSpan={1}>Родители (иные законные представители) несовершеннолетних жестоко обращаются с ними</td>
      <td><input type="checkbox" name="parentCruel" value={1} className='act__checkbox' onChange={cruelHandler}/></td>
      <td colSpan={3}><Select onChange={cruelListHandler}mode="multiple" allowClear className='select' placeholder='Укажите родителей'>
        {Array.isArray(parents) && parents.map(el => {
        return <Select.Option key={el.parentId}>{el.fio}</Select.Option>
        })}
        </Select></td>
      <td></td>
    </tr>
    <tr>
      <td colSpan={1}>Родители (иные законные представители) несовершеннолетних злоупотребляют алкоголем и (или) употребляют иные психоактивные вещества</td>
      <td><input type="checkbox" name="parentAlcoDrugs" value={1} className='act__checkbox' onChange={alcoDrugsHandler}/></td>
      <td colSpan={3}><Select onChange={alcoDrugsListHandler}mode="multiple" allowClear className='select' placeholder='Укажите родителей'>
        {Array.isArray(parents) && parents.map(el => {
        return <Select.Option key={el.parentId}>{el.fio}</Select.Option>
        })}
        </Select></td>
      <td></td>
    </tr>
    <tr>
      <td colSpan={1}>Никто из родителей (иных законных представителей) несовершеннолетних не работает по зависящим от них причинам</td>
      <td><input type="checkbox" name="parentNotWork" value={1} className='act__checkbox' onChange={notWorkHandler}/></td>
      <td colSpan={3}><Select onChange={notWorkListHandler}mode="multiple" allowClear className='select' placeholder='Укажите родителей'>
        {Array.isArray(parents) && parents.map(el => {
        return <Select.Option key={el.parentId}>{el.fio}</Select.Option>
        })}
        </Select></td>
      <td></td>
    </tr>
    <tr>
      <td>Поясняющая, иная информация о неблагополучии</td>
      <td colSpan={5}><Input.TextArea maxLength={200} onChange={otherInfoHandler}></Input.TextArea></td>
    </tr>
    <tr>
      <td>Влияние неблагополучия на ребенка</td>
      <td colSpan={5}><Input.TextArea maxLength={200} onChange={influenceHandler}></Input.TextArea></td>
    </tr>
    <tr>
      <td>Заключение</td>
      <td colSpan={5}> <Select onChange={conclusionHandler} allowClear className='select'  placeholder='Заключение' style={{maxWidth: '100%'}}>
        {[
          {name: 'Семья (несовершеннолетний) предположительно находится в социально опасном положении'},
          {name: 'Семья (несовершеннолетний) предположительно находится в трудной жизненной ситуации'},
          {name: 'Семья (несовершеннолетний) предположительно не находится ни в социально опасном положении, ни в иной трудной жизненной ситуации'}].map(el => {
        return <Select.Option key={el.name}>{el.name}</Select.Option>
        })}
        </Select></td>
    </tr>
    <tr>
      <td>Примечание</td>
      <td colSpan={5}><Input.TextArea maxLength={200} onChange={noteHandler}></Input.TextArea></td>
    </tr>
    <tr>
      <td>Специалист</td>
      <td colSpan={2}><Input maxLength={200}onChange={specHandler}></Input></td>
      <td>Руководитель органа (учреждения)</td>
      <td colSpan={2}><Input maxLength={200}
      onChange={leadHandler}></Input></td>
    </tr>
    <tr>
      <td colSpan={2}><Button type='primary' onClick={saveHandler}>Сохранить</Button>         
      <Button type='default' onClick={cancelHandler}>Отмена</Button></td>
      <td colSpan={4}>{error && <Alert message="Заполните поля" type="error" showIcon />}</td>
    </tr>
    
    
    </>)
  }

    const mappedRows = Array.isArray(props.data) && props.data && props.data.map((el) => {
        return <EditableRow 
        id={el.id} 
        key={el.id} 
        dateViewed={el.dateViewed}
        dateWrited={el.dateWrited}
        source={el.source}
        addressFact={el.addressFact}
        addressReg={el.addressReg}
        guide={el.guideId}
        childId={props.id}
        file={el.file}
        access={props.access}
         />
    })

    return (
      <div>
        <table>
          <thead className="ant-table-thead">
            <tr>
              <th className="ant-table-cell">Дата составления акта</th>  
              <th className="ant-table-cell">Источник поступления информации о семье</th>
              <th className="ant-table-cell">Дата выявления</th>
              <th className="ant-table-cell">Адрес регистрации</th>
              <th className="ant-table-cell">Адрес проживания</th>
              <th className="ant-table-cell">Акт</th>
            </tr>
          </thead>
          <tbody className="ant-table-tbody">
            {mappedRows}
            {adding && <NewRow id={famData.id}/>}
            
          </tbody>
        </table>
        {!adding && <Button onClick={addHandler}><PlusSquareOutlined />Добавить</Button>} 
      </div>
        
    )
}

export default FamilyActTable
