import React from "react";
import { List } from "antd";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchChildByInst } from "redux/reducers/childByInst";

import { PairLink } from "components";

function ChildList(props) {
  const childrenData = useSelector((state) => state.childByInst);
  const dispatch = useDispatch();
  const urlId = useParams().id;
  React.useEffect(() => {
    dispatch(fetchChildByInst(urlId));
  }, [dispatch]);

  const renderChildren = childrenData.isLoaded && childrenData.data.map((el) => {
    return (
      <List.Item>
        <PairLink descr={el.name} link={`/children/view/${el.id}`} text='Перейти' key={el.name}/>
      </List.Item>
    );
  });

  return (
    <div>
      {childrenData.isLoaded && (
        <div>
          <h1>{`Список детей, прикрепленных к ${childrenData.data[0].institution.name}`}</h1>
          <List>
            {renderChildren}
          </List>
        </div>
        
      )}
    </div>
  );
}

export default ChildList;
