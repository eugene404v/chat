import React from "react";
import { Button, Spin, Pagination } from "antd";
import { useSelector, useDispatch } from "react-redux";

import DocumentsItem from "./DocumentsItem";
import DocumentNew from './DocumentNew'
import { fetchDocs } from "redux/reducers/documentsReducer";
import './Documents.scss'

function Documents() {
  const [access, setAccess] = React.useState(false);
  const [adding, setAdding] = React.useState(false);
  const docsData = useSelector((state) => state.documentsReducer);
  const userData = useSelector(state => state.userReducer)
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchDocs(docsData.page));
    if (userData.lvl==='admin' || userData.lvl === 'region') {
      setAccess(true)
    }
  }, [dispatch, docsData.page, userData.lvl]);

  const addHandler = () => {
    setAdding(true);
  };

  const cancelHandler = () => {
    setAdding(false);
  };

  const paginationHandler = (page) => {
    dispatch(fetchDocs(page));
  };

  return (
    <>
      {docsData.isLoaded ? (
        <section className="news">
          <h1>Документы</h1>
          <div className="news__list">
            {Array.isArray(docsData.docs) &&
              docsData.docs &&
              docsData.docs.map((el) => (
                <DocumentsItem
                  id={el.id}
                  key={el.name + "" + el.id}
                  name={el.name}
                  file={el.file}
                  author={el.author}
                  date={el.date}
                  access={access}
                />
              ))}
          </div>
          {access && !adding && (
            <Button onClick={addHandler}>Добавить документ</Button>
          )}
          {access && adding && <DocumentNew cancelHandler={cancelHandler}/>}
          {(docsData.total>10) && <Pagination
            defaultCurrent={1}
            total={docsData.total}
            onChange={paginationHandler}
            showSizeChanger={false}
          />}
        </section>
      ) : (
        <Spin size="large" />
      )}
    </>
  );
}
//addnew pages
export default Documents;
