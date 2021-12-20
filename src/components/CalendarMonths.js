import React, { Component } from 'react'
import { Button } from 'reactstrap'

export default class CalendarMonths extends Component{

    render() {

        return (
            <Button className={this.props.item.id == this.props.monthIsSelected ? 'months active-month' : 'months btnColor'} value={this.props.item.id} name="currentMonth" onClick={this.props.onChangeMonth}>
                {this.props.item.sname}  
            </Button >
         
            )
    }


}