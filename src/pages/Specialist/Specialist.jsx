import React from 'react'
import {Form, Button, Table} from 'antd'

import {EditableText, EditableNum, EditableSelect, PairLink} from "components";

function Specialist() {
    const [access, setAccess] = React.useState(false)

    const accessHandler = () => {
      if (access === false) {
        setAccess(true)
      } else {
        setAccess(false)
      }
    }
    
    const onFinish = values => {
      console.log(values);
    };

    const data = [
        {
          key: '1',
          job: {
              title: 'nice',
            allJobs: [{value: 'nice', text: 'nice'}, {value: 'developer', text: 'developer'}],
          },       
          jobChar: 'nice',
          allJobChars: [{value: 'nice', text: 'nice'}, {value: 'developer', text: 'developer'}],
          jobType: 'nice',
          allJobTypes: [{value: 'nice', text: 'nice'}, {value: 'developer', text: 'developer'}],
          jobExpereince: 1,
        }
      ];

      const columns = [
        {
          title: 'Должность',
          render: () => <EditableSelect descr='' text={data[0].job.title} access={access} selectArray={data[0].job.allJobs} fieldName='job'/>,
        },
        {
            title: 'Характер работы',
            render: () => <EditableSelect descr='' text={data[0].jobChar} access={access} selectArray={data[0].allJobChars} fieldName='jobChar'/>,
        },
        {
            title: 'Вид работы',
            render: () => <EditableSelect descr='' text={data[0].jobType} access={access} selectArray={data[0].allJobTypes} fieldName='jobType'/>,
        },
        {
            title: 'Стаж в должности',
            render: () => <EditableNum descr='' text={data[0].jobExpereince} access={access} fieldName='jobExpereince'/>,
        },
       
      ];

    return (
        <section className="specialist">
            <h1>КАРТА СПЕЦИАЛИСТА</h1>
            <Button onClick={accessHandler}>change access</Button>
        <Form onFinish={onFinish} initialValues={{ 
                fullName: 'Иван Иваныч',
                district: 'Ленинский',
                organization: 'ОПГ МВД',
                tel: 88005553535,
                mail: 'index@index.ru',
                job: data[0].job.title,
                jobChar: data[0].jobChar,
                jobType: data[0].jobType,
                jobExpereince: data[0].jobExpereince,
                remember: true,
        }} >
            <EditableText descr='ФИО' text='Иван Иваныч' access={access} fieldName='fullName'/>
            <EditableSelect descr='Район' text='Ленинский' access={access} selectArray={[{value: 'Ленинский', text: 'Ленинский'}, {value: 'Кировский', text: 'Кировский'}]}     fieldName='district' />
            <EditableSelect descr='Организация' text='ОПГ МВД' access={access} selectArray={[{value: 'ОПГ МВД', text: 'ОПГ МВД'}, {value: 'ОПГ ФСБ', text: 'ОПГ ФСБ'}]} fieldName='organization' />
            <EditableText descr='Телефон' text='88005553535' access={access} fieldName='tel'/>
            <EditableText descr='Почта' text='index@index.ru' access={access} fieldName='mail'/>
            <PairLink descr='Список специалистов организации' link='/im' text='Перейти' />
            <Table bordered
                pagination={false}
                dataSource={data}
                columns={columns}
                />
                

           
            
            
            {access && <Button  type="primary" htmlType="submit">Сохранить изменения</Button>}
        </Form>

        </section>
    )
}

export default Specialist
