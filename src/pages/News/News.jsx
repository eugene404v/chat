import React from "react";
import { Button, Spin, Pagination  } from "antd";
import {useSelector, useDispatch} from 'react-redux'

import NewsItem from "./NewsItem";
import NewNewsItem from "./NewNewsItem";
import './News.scss'
import { fetchNews} from "redux/reducers/newsReducer";



function News() {
  const [access, setAccess] = React.useState(true);
  const [adding, setAdding] = React.useState(false)
  const newsData = useSelector(state => state.newsReducer)
  const dispatch = useDispatch()

  React.useEffect(() => {
dispatch(fetchNews(newsData.page))
  }, [dispatch])

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
      <Pagination defaultCurrent={1} total={newsData.total} onChange={paginationHandler}/>
    </section>
    : 
    <Spin size="large" />} 
    </>
  );
}

export default News;
