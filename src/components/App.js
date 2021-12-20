import React, { Component } from 'react';
import { Route } from 'react-router';
import { BrowserRouter, Switch } from 'react-router-dom';
import Login from './Login';
import Layout from "./Layout";
import ActivityHistory from "./ActivityHistory/ActivityHistory";
import Home from "./Home";
import ActivityApprove from './ActivityApprove/ActivityApprove'
import Report from './Report/Report'
import PrivateRoute from './PrivateRoute'
import PersonalProfile from './PersonalProfile/PersonalProfile'
import RoleInfo from './RoleInfo/RoleInfo'
import customer from './Customer/customer';
import Employee from './Employee/Employee';
import Project from './Project/Project'
import ReportByProject from './ReportByProject/ReportByProject'
import WorkingDayCalendar from './WorkingDayCalendar/WorkingDayCalendar'

export default class App extends Component {
    render() {

        return (
            <BrowserRouter>
                <Switch>
                    <Route path='/Login' component={Login} />
                    <Layout>
                        <PrivateRoute Route exact path='/' component={Home} />
                        <PrivateRoute Route exact path='/ActivityHistory' component={ActivityHistory} />
                        <PrivateRoute Route exact path='/ActivityApprove' component={ActivityApprove} />
                        <PrivateRoute Route exact path='/Report' component={Report} />
                        <PrivateRoute Route exact path='/PersonalProfile' component={PersonalProfile} />
                        <PrivateRoute Route exact path='/Role' component={RoleInfo} />
                        <PrivateRoute Route exact path='/Customer' component={customer} />
                        <PrivateRoute Route exact path='/Employee' component={Employee} />
                        <PrivateRoute Route exact path='/Project' component={Project} />
                        <PrivateRoute Route exact path='/ReportbyProject' component={ReportByProject} />
                        <PrivateRoute Route exact path='/WorkingDays' component={WorkingDayCalendar} />
                    </Layout>
                </Switch>
            </BrowserRouter>

            //<Layout>
            //    <Route exact path='/' component={Home} />
            //    <Route exact path='/ActivityHistory' component={ActivityHistory} />
            //    {/*<Route exact path='ActHistory' component={ActivityHistory} />
            //<Route exact path='AppActivity' component={ApproveActivity} />
            //<Route exact path='/Report' component={Report} />
            //<Route exact path='/SystemMain' component={SystemMain} />*/}
            //</Layout>
        );
    }
}