import React from 'react'
import {Button} from 'antd'
import axios from 'axios'
import { refreshNews, fetchNews } from 'redux/reducers/newsReducer'
import {useDispatch, useSelector} from 'react-redux'
import moment from 'moment'

function NewsItem(props) {
    const dispatch = useDispatch()
    const newsData = useSelector(state => state.newsReducer)
    const deleteHandler = () => {
        axios.post(`/news/del/${props.id}`, {}, {
            headers: {
                accept: 'text/json'
            }
        }).then((response) => {
            dispatch(refreshNews())
            dispatch(fetchNews(newsData.page))
        })
    }

    return (
        <article className='news__item'>
            <h3 className='news__title'>{props.name}</h3>
            <p className="news__text">{props.text}</p>
            <div className="news__bottom">
                <p className="news__date">{moment(props.date).format('DD-MM-YYYY').toString()}</p> 
                {props.access && <Button onClick={deleteHandler}>Удалить новость</Button>}
            </div>
            
            
        </article>
    )
}

export default NewsItem
