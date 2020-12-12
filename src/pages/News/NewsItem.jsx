import React from 'react'
import {Button} from 'antd'
import axios from 'axios'
import { refreshNews, fetchNews } from 'redux/reducers/newsReducer'
import {useDispatch, useSelector} from 'react-redux'

function NewsItem(props) {
    const dispatch = useDispatch()
    const deleteHandler = () => {
        axios.post(`/news/del/${props.id}`, {}, {
            headers: {
                accept: 'text/json'
            }
        }).then((response) => {
            dispatch(refreshNews())
            dispatch(fetchNews())
        })
    }

    return (
        <article className='news__item'>
            <h2 className='news__title'>{props.name}</h2>
            <p className="news__text">{props.text}</p>
            <div className="news__bottom">
                <p className="news__date">{props.date}</p>
                <p className="news__author">{props.author.fio}</p>
            </div>
            {props.access && <Button onClick={deleteHandler}>Удалить новость</Button>}
            
        </article>
    )
}

export default NewsItem
