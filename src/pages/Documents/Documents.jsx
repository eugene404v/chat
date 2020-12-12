import React from "react";
import { Button, Spin, Pagination } from "antd";
import { useSelector, useDispatch } from "react-redux";

import DocumentsItem from "./DocumentsItem";
import DocumentNew from './DocumentNew'
import { fetchDocs } from "redux/reducers/documentsReducer";

function Documents() {
  const [access, setAccess] = React.useState(true);
  const [adding, setAdding] = React.useState(false);
  const docsData = useSelector((state) => state.documentsReducer);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchDocs(docsData.page));
  }, [dispatch, docsData.page]);

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
