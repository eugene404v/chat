import React from "react";
import { EditableCell, EditableRowTrigger } from "components";
import {useSelector, useDispatch} from 'react-redux'
import {fetchCrimeIds, refreshChild, fetchChild} from 'redux/reducers/childReducer'
import {Alert, Button } from 'antd'
import axios from 'axios'
import { DeleteOutlined, PlusSquareOutlined   } from "@ant-design/icons";


const EditableRow = (props) => {
  const dispatch = useDispatch()
  const childData = useSelector(state => state.childReducer)
    const [edit, setEdit] = React.useState(false)
    const [day, setDay] = React.useState(props.date)
    const [type, setType] = React.useState(props.type || props.type.name)
    const [typeId, setTypeId] = React.useState(props.type && props.type.id)
    const [article, setArticle] = React.useState(props.article && props.article.name)
    const [articleId, setArticleId] = React.useState(props.article && props.article.id)
    const [articleType, setArticleType] = React.useState(props.article && props.article.for_type)
    const [descr, setDescr] = React.useState(props.descr)
    const [exists, setExists] = React.useState(true)


    
    const dayHandler = (_, dateString) => {
      setDay(dateString)
    }
  
    const typeHandler = (val) => {
        setTypeId(val)
        setType(childData.crimeTypesArr.find(el=> el.id == val).name)
    }
  
    const articleHandler = (val) => {
        setArticleId(val)
        setArticle(childData.crimeArticlesArr.find(el=> el.id == val).name)
    }

    const descrHandler = (e) => {
        setDescr(e.target.value)
    }
  
    const editHandler = () => {
      childData._guideFields && dispatch(fetchCrimeIds(childData._guideFields.childCrimes.fromId, type))
      setEdit(true)
      }
    
    const cancelHandler = () => {
      setEdit(false)
    }
  
    const saveHandler = () => {
        const stateData = {
          date: day, type: typeId, article: articleId, article_text: descr
        }
        const formData = {}
        var formdata = new FormData();
        let key
        for (key in stateData){
            formdata.append(key, stateData[key])
        }
        axios.post(`/children/editExtendedInChild/crimes/${props.id}/${props.childId}`,formdata, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': "text/json"
          },
        })
        .then(function (response) {
          setEdit(false)
        })
      }
  
      const deleteHandler = () => {
        setExists(false)
        axios.post(`/children/delExtendFromChild/crimes/${props.id}/${props.childId}`, {}, {headers: {
          Accept: "text/json"
        }})
      } 
  
    return (
        exists && <tr index={props.id} display="table-row">
          <EditableCell day="true" editing={edit}  onDateChange={dayHandler}>{day}</EditableCell>
          <EditableCell select="true" editing={edit} selectArray={childData.crimeTypesArr} onSelectChange={typeHandler}>{typeof(type)==='string'?type:(type && type.name)}</EditableCell>
          <EditableCell select="true" editing={edit} selectArray={childData.crimeArticlesArr} onSelectChange={articleHandler}>{article}</EditableCell>
          <EditableCell disabled={(type==='Административное' || typeId==='Административное') && articleId!=15} input="true" editing={edit} onInputChange={descrHandler}>{descr}</EditableCell>
          {props.access && <EditableRowTrigger editing={edit} onedit={editHandler} onCancel={cancelHandler} onSave={saveHandler}/>}
          {props.access && <td><Button onClick={()=>deleteHandler(props.parentId)}><DeleteOutlined /></Button></td>}
        </tr>
    );
  };

function ChildCrimeTable(props) {
  const dispatch = useDispatch()
  const childData = useSelector(state => state.childReducer)
  const [adding, setAdding] = React.useState(false)

  const addHandler = () => {
    childData._guideFields && dispatch(fetchCrimeIds(childData._guideFields.childCrimes.fromId, 'Административное'))
      setAdding(true)
    }

    const NewRow = (props) => {
      const [error, setError] = React.useState(false)
      const [day, setDay] = React.useState()
    const [type, setType] = React.useState()
    const [typeId, setTypeId] = React.useState()
    const [article, setArticle] = React.useState()
    const [articleId, setArticleId] = React.useState()
    const [descr, setDescr] = React.useState()

      const dayHandler = (_, dateString) => {
        setDay(dateString)
      }
    
      const typeHandler = (val) => {
          setTypeId(val)
          setType(childData.crimeTypesArr.find(el=> el.id == val).name)
          val !== 'Административное' && setArticle('') && setArticleId('')
      }
    
      const articleHandler = (val) => {
          setArticleId(val)
          setArticle(childData.crimeArticlesArr.find(el=> el.id == val).name)
      }
  
      const descrHandler = (e) => {
          setDescr(e.target.value)
      }
    
      const cancelHandler = () => {
        setAdding(false)
      }
    
      const saveHandler = () => {
        
        const stateData = {
          date: day, type: typeId, article: articleId, article_text: !descr?'':descr
        } 
        if ((!stateData.type)||(!stateData.date)) {
          console.log(stateData)
          setError(true)
        } else {
          dispatch(refreshChild())
          const formData = {}
          var formdata = new FormData();
          let key
          for (key in stateData){
              formdata.append(key, stateData[key])
          }
          axios.post(`/children/addExtendedToChild/crimes/${props.id}`,formdata, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Accept': "text/json"
            },
          })
          .then(function (response) { 
            setAdding(false)
            dispatch(fetchChild(props.id))
          })
        }
      }
  
      return (<>
      <tr>
      <EditableCell day="true" editing={adding}  onDateChange={dayHandler} placeholder='Укажите дату'>{day}</EditableCell>
          <EditableCell select="true" editing={adding} selectArray={childData.crimeTypesArr} onSelectChange={typeHandler} placeholder='Выберите тип'></EditableCell>
          <EditableCell disabled={(type!=='Административное' || typeId!=='Административное')}select="true" editing={adding} selectArray={childData.crimeArticlesArr} onSelectChange={articleHandler} placeholder='Выберите статью'></EditableCell>
          <EditableCell disabled={(type==='Административное' || typeId==='Административное') && articleId!=15}input="true" editing={adding} onInputChange={descrHandler} placeholder='Краткое описание' maxLength={60}></EditableCell>
          <EditableRowTrigger editing={true} onCancel={cancelHandler} onSave={saveHandler}/>
      </tr>
      {error && <Alert message="Заполните поля" type="error" showIcon />}
      </>)
    }

    const mappedRows =  props.data && (Array.isArray(props.data)===true) && props.data.map((el) => {
        return <EditableRow 
        id={el.id} 
        key={el.id} 
        date={el.date}
        type={el.type} 
        article={el.article}
        descr={el.article_text}
        guide={el.guideId}
        childId={childData.id}
        access={props.access}
         />
    })

    return (<>
        <table>
        <thead className="ant-table-thead">
          <tr>
            <th className="ant-table-cell">Дата</th>  
            <th className="ant-table-cell">Тип правонарушения</th>
            <th className="ant-table-cell">Статья</th>
            <th className="ant-table-cell">Краткое описание</th>
            <th className="ant-table-cell"></th>
            {props.access && <th className="ant-table-cell"></th>}
          </tr>
        </thead>
        <tbody className="ant-table-tbody">
          {mappedRows}
          {adding && <NewRow id={childData.id}/>}
          
        </tbody>
    </table>
    {!adding && <Button onClick={addHandler}><PlusSquareOutlined />Добавить</Button>}
    </>)
}

export default ChildCrimeTable
