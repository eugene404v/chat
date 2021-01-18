import React from 'react'
import { Switch, Route, Redirect } from "react-router-dom";
import { Institution, Specialist, Child, ChildList, Parent, Family, News, Create, CreateChild, CreateFamily, CreateInstitution, CreateParent, CreateSpecialist, Documents, LK, Archives, CommonReports, ChildrenReport, FamilyReport, ParentsReport, InstReport, SpecsReport, SpecsByInst, ChildrenByInst, AutoCheck} from "pages";
import { SideBar, NavBar } from "components";
import './AppLayout.scss'
import {useLocation, useHistory} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import { fetchMe } from 'redux/reducers/userReducer';
import axios from 'axios'

//                <Redirect to="/cabinet" />
function AppLayout() {
    const location = useLocation();
    const currentUrl = location.pathname
    const dispatch = useDispatch()
    const history = useHistory()
    const userData = useSelector(state => state.userReducer)

    React.useEffect(() => {
      dispatch(fetchMe())
      if (!userData || userData.id < 1) {
        //history.push('/login')
      }
    }, [dispatch, userData.isLoaded, userData.id, currentUrl])



    return (
        <div className='app'>
              {(currentUrl !== '/login') && <NavBar />}
              {(currentUrl !== '/login') && <SideBar /> }
              <div className="app__content">
                <Switch>
                  <Route exact path={"/institution/view/:id"} component={Institution} />
                  <Route exact path={"/users/view/:id"} component={Specialist} />
                  <Route exact path={"/children/view/:id"} component={Child} />
                  <Route exact path={"/parents/view/:id"} component={Parent} />
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
                <Route exact path={"/commonreports"} component={CommonReports} />
                <Route exact path={"/childrenreports"} component={ChildrenReport} />
                <Route exact path={"/familyreport"} component={FamilyReport} />
                <Route exact path={"/parentsreport"} component={ParentsReport} />
                <Route exact path={"/instreport"} component={InstReport} />
                <Route exact path={"/specsreport"} component={SpecsReport} />
                <Route exact path={"/specsbyinst/:id"} component={SpecsByInst} />
                <Route exact path={"/childrenbyinst/:id"} component={ChildrenByInst} />
                <Route exact path={"/autocheck"} component={AutoCheck} />

                </Switch>
                
              </div>
              
          </div>
    )
}

export default AppLayout
