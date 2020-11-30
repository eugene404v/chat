import React from "react";
import {Route} from "react-router-dom"

import "./Auth.scss";
import {LoginForm, RegisterForm} from 'modules'
function Auth() {
  

  return (
    <section className="auth">
      <div className="auth__content">
        <Route exact path={['/', '/login']} component={LoginForm}/>
        <Route exact path={'/register'} component={RegisterForm}/>
      </div>
    </section>
  );
}

export default Auth;
