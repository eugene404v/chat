import React from 'react'
import moment from "moment";
import { Button, Alert } from 'antd';
import axios from 'axios'
import {useDispatch} from 'react-redux'
import { fetchDocs, refreshDocs } from 'redux/reducers/documentsReducer';


function DocumentNew(props) {
    const dispatch = useDispatch()
    const [date, setDate] = React.useState(moment().format("YYYY-MM-DD").toString())
    const [name, setName] = React.useState('')
    const [file, setFile] = React.useState('')
    const [error, setError] = React.useState(false)

    const nameHandler = (e) => {
        setName(e.target.value)
    }

    const fileHandler = (e) => {
        setFile(e.target.value)
    }
    const saveHandler = () => {
        const stateData = {date, name, file}
        if ((!stateData.name)||(!stateData.file)) {
            console.log(stateData)
            setError(true)
          } else {
            const formData = {}
            var formdata = new FormData();
            let key
            for (key in stateData){
                formdata.append(key, stateData[key])
            }
            axios.post(`/documents/add`,formdata, {
              headers: {
                'Content-Type': 'multipart/form-data',
                'Accept': "text/json"
              },
            })
            .then(function (response) { 
                props.cancelHandler()
                dispatch(refreshDocs())
                dispatch(fetchDocs(1))
            })}
    }
    return (
        <div>
            <input type="text" onChange={nameHandler}/>
            <input type="file" onChange={fileHandler}/>
            <Button onClick={saveHandler}>Сохранить</Button>
            <Button onClick={props.cancelHandler}>Отмена</Button>
            {error && <Alert message="Error" type="error" showIcon />}
        </div>
    )
}

export default DocumentNew
