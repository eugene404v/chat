import React from "react";
import { Button, Spin, Pagination  } from "antd";
import {useSelector, useDispatch} from 'react-redux'

import NewsItem from "./NewsItem";
import NewNewsItem from "./NewNewsItem";
import './News.scss'
import { fetchNews} from "redux/reducers/newsReducer";



function News() {
  const [access, setAccess] = React.useState(false);
  const [adding, setAdding] = React.useState(false)
  const newsData = useSelector(state => state.newsReducer)
  const userData = useSelector(state => state.userReducer)
  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(fetchNews(newsData.page))
    if (userData.lvl==='admin' || userData.lvl === 'region') {
      setAccess(true)
    }
  }, [dispatch, userData.lvl])

  const addHandler = () => {
    setAdding(true)
  }
  
  const cancelHandler = () => {
      setAdding(false)
  }

  const paginationHandler = (page) => {
      dispatch(fetchNews(page))
  }
  
  return (<>
    {newsData.isLoaded ? 
    <section className="news">
      <h1>Новости</h1>
      <div className="news__list">
        {Array.isArray(newsData.news) && newsData.news && newsData.news.map((el) => (
          <NewsItem
            id={el.id}
            key={el.name + '' + el.id}
            name={el.name}
            text={el.text}
            author={el.author}
            date={el.date}
            access={access}
          />
        ))}
      </div>
      {access && !adding && <Button onClick={addHandler}>Добавить новость</Button>}
      {access && adding && <NewNewsItem onCancel={cancelHandler} />}
      <Pagination defaultCurrent={1} total={newsData.total} onChange={paginationHandler} showSizeChanger={false}/>
    </section>
    : 
    <Spin size="large" />} 
    </>
  );
}

export default News;
