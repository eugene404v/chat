import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import "App.scss";
import { Auth, AppLayout} from "pages";
import { Provider } from "react-redux";
import store from 'redux/store'


function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="app">
          <Route exact path={"/login"} component={Auth} />
          <Route path={"/"} component={AppLayout} />
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
