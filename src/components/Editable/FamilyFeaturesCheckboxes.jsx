import React from "react";
import { Checkbox, Row, Col } from "antd";


import { Pair } from "components";
import "./Editable.scss";



function FamilyFeaturesCheckboxes(props) {
  const checkData = ['Благополучная', 'ТЖС', 'СОП: педагогически некомпетентная', 'СОП: конфликтная', 'СОП: асоциальная']

  const [answer, setAnswer] = React.useState(checkData[props.initial - 1]);
 
  const checkHandler = (e) => {
      setAnswer(checkData[e.target.value - 1]);
      dispatch(setFamilyType(e.target.value))
  };

  return (
    <div className="editable">
      <Pair descr='Вид семьи'>{answer}</Pair>
      {props.access && (
          <Form.Item name="familyFeatures">
          <Checkbox.Group onChange={checkHandler}>
              <Row>
              <Col span={8}>
                  <Checkbox value="1" style={{ lineHeight: '32px' }}>
                  Благополучная
                  </Checkbox>
              </Col>
              <Col span={8}>
                  <Checkbox value="2" style={{ lineHeight: '32px' }}>
                  ТЖС
                  </Checkbox>
              </Col>
              <Col span={8}>
                  <Checkbox value="3" style={{ lineHeight: '32px' }}>
                  СОП: педагогически некомпетентная
                  </Checkbox>
              </Col>
              <Col span={8}>
                  <Checkbox value="4" style={{ lineHeight: '32px' }}>
                  СОП: конфликтная
                  </Checkbox>
              </Col>
              <Col span={8}>
                  <Checkbox value="5" style={{ lineHeight: '32px' }}>
                  СОП: асоциальная
                  </Checkbox>
              </Col>
              
              </Row>
          </Checkbox.Group>
      </Form.Item>
      )}
    </div>
  );
}

export default FamilyFeaturesCheckboxes;
