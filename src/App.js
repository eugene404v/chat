import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import "App.scss";
import { Auth, AppLayout} from "pages";
import { Provider } from "react-redux";
import store from 'redux/store'
import { ConfigProvider } from 'antd';
import ruRU from 'antd/lib/locale/ru_RU';



function App() {
  return (
    <ConfigProvider locale={ruRU}>
      <Provider store={store}>
      <BrowserRouter>
        <div>
          <Route exact path={"/login"} component={Auth} />
          <Route path={"/"} component={AppLayout} />
        </div>
      </BrowserRouter>
    </Provider></ConfigProvider>
  );
}

export default App;
