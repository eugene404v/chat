import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import "App.scss";
import { Auth, Institution, Specialist, Child, ChildList } from "pages";
import { Provider } from "react-redux";
import store from 'redux/store'

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="app">
          <Route exact path={["/", "/login"]} component={Auth} />
          <Route exact path={"/institution/view/:id"} component={Institution} />
          <Route exact path={"/spec"} component={Specialist} />
          <Route exact path={"/children/view/:id"} component={Child} />
          <Route exact path={"/children/filter/institution/:id"} component={ChildList} />
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
