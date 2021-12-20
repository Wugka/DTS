import React, { Component,} from 'react';
import TopNavBar from './TopNavBar';
import { library } from "@fortawesome/fontawesome-svg-core";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.css';

//import { library } from '../font-awesome/fontawesome-svg-core'
//import { far } from '../font-awesome/free-regular-svg-icons'
//import { fas } from '../font-awesome/free-solid-svg-icons'

library.add(far, fas)

export default class App extends Component {
    static displayName = App.name;

    render() {
        return (
            <div>
                <TopNavBar />
                {this.props.children}
            </div>
        );
    }
}