import React from "react";
import { Tabs } from "antd";
import { useSelector } from "react-redux";

import LkActiveTable from "./LkActiveTable";
import LkProfileTab from "./LkProfileTab";
import LkReports from "./LkReports";
import LkUsersList from "./LkUsersList";



function LK() {
  const [access, setAccess] = React.useState(true);
  const userData = useSelector(state => state.userReducer)

  return (
    <div>
      <Tabs defaultActiveKey="1" type="card" size="large">
        <Tabs.TabPane tab="Профиль" key="1">
          <LkProfileTab fio={userData.fio} inst={userData.institution && userData.institution.name} userId={userData.id} instId={userData.institution && userData.institution.id} level={userData.type}/>
        </Tabs.TabPane>
        {access && <Tabs.TabPane tab="Отслеживание активности" key="3">
          <LkActiveTable />
        </Tabs.TabPane>}
        {access && <Tabs.TabPane tab="Отчет" key="4">
          <LkReports />
        </Tabs.TabPane>}
        {access && <Tabs.TabPane tab="Пользователи" key="5">
          <LkUsersList />
        </Tabs.TabPane>}
      </Tabs>
    </div>
  );
}

export default LK;
