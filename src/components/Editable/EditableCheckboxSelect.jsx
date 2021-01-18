import React from "react";
import { Form, Switch, Select } from "antd";

import { Pair, EditableSelect, AsyncSelect } from "components";
import './Editable.scss'

function EditableCheckboxSelect(props) {
    const initialAnswer = props.initialBoolean ? 'Да' : 'Нет'
const [answer, setAnswer] = React.useState(initialAnswer)
const [opened, setOpened] = React.useState(props.initialBoolean)


const checkHandler = (checked, e) => {
    if (checked == true) {
        setAnswer('Да')
        setOpened(true)
    } else {
        setAnswer('Нет')
        setOpened(false)
    }
}

  return (
    <div className="editable">
      <Pair descr={props.descr}>{answer}</Pair>
      {props.access && (
        <div> 
          <Form.Item  name='asylumBoolean'>
                <Switch onChange={checkHandler} defaultChecked={opened}></Switch>
          </Form.Item>
          {opened && <Form.Item fieldName={props.fieldName}> 
                <div className="editable"><div className="pair"><div className="pair__descr">Организация</div><div className="pair__value"></div></div>
                    <AsyncSelect type='institution' onSelectHandler={props.onSelectHandler}/>
                </div>
            </Form.Item>}
        </div>
      )}
    </div>
  );
}

export default EditableCheckboxSelect;
