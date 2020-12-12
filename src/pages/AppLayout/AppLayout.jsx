import React from 'react'
import { Route } from "react-router-dom";
import { Institution, Specialist, Child, ChildList, Parent, Family, News, Create, CreateChild, CreateFamily, CreateInstitution, CreateParent, CreateSpecialist, Documents, LK, Archives} from "pages";
import { SideBar, NavBar } from "components";
import './AppLayout.scss'
import {useLocation} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import { fetchMe } from 'redux/reducers/userReducer';


function AppLayout() {
    const location = useLocation();
    const currentUrl = location.pathname
    const dispatch = useDispatch()
    const userData = useSelector(state => state.userReducer)

    React.useEffect(() => {
      dispatch(fetchMe())
    }, [dispatch])

    return (
        <div className='app'>
              {(currentUrl !== '/login') && <NavBar />}
              {(currentUrl !== '/login') && <SideBar /> }
              <div className="app__content">
                <Route exact path={"/institution/view/:id"} component={Institution} />
                <Route exact path={"/users/view/:id"} component={Specialist} />
                <Route exact path={"/children/view/:id"} component={Child} />
                <Route exact path={"/parents/view/:id"} component={Parent} />
                <Route exact path={"/children/filter/institution/:id"} component={ChildList} />
                <Route exact path={"/family/view/:id"} component={Family} />
                <Route exact path={"/"} component={News} />
                <Route exact path={"/create"} component={Create} />
                <Route exact path={"/create/children"} component={CreateChild} />
                <Route exact path={"/create/family"} component={CreateFamily} />
                <Route exact path={"/create/institution"} component={CreateInstitution} />
                <Route exact path={"/create/parents"} component={CreateParent} />
                <Route exact path={"/create/specialists"} component={CreateSpecialist} />
                <Route exact path={"/documents"} component={Documents} />
                <Route exact path={"/cabinet"} component={LK} />
                <Route exact path={"/archives"} component={Archives} />
              </div>
              
          </div>
    )
}

export default AppLayout
