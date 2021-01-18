import { Button } from 'antd'
import { DownloadOutlined } from '@ant-design/icons';
import React from 'react'
import axios from 'axios'
import moment from 'moment'
import {useDispatch, useSelector} from 'react-redux'
import { refreshDocs, fetchDocs } from 'redux/reducers/documentsReducer'

function DocumentsItem(props) {
    const dispatch = useDispatch()
    const deleteHandler = () => {
        axios.post(`/documents/del/${props.id}`, {}, {
            headers: {
                accept: 'text/json'
            }
        }).then((response) => {
            dispatch(refreshDocs())
            dispatch(fetchDocs(1))
        })
    }

    return (
        <li className='documents__item'>
            <h3 className="documents__title">{props.name}</h3>
            <Button icon={<DownloadOutlined/>} className='documents__btn'>
                <a href={`/files/download/${props.file}`} download>Скачать</a> 
            </Button>
            <p>{moment(props.date).format('DD-MM-YYYY').toString()}</p>
            {props.access && <Button onClick={deleteHandler} className='documents__delete'>Удалить документ</Button>}
        </li>
    )
}
//file, delete
export default DocumentsItem
