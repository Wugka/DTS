import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import MainCalendar from "./MainCalendar";
import ActivityDetail from "./ActivityDetail";
import DailyTimeSheet from "./DailyTimeSheet";
import axios from 'axios'
import AuthService from './AuthService';
import subDays from 'date-fns/subDays';

var auth = new AuthService()

export default class Home extends Component {
    constructor() {
        super()
        var now = new Date()
        var month = now.getMonth()
        var year = now.getFullYear()
        var day = now.getDate()

        this.state = {
            currentYear: year, currentDay: day, currentMonth: month, jsondata: [], jsonalldata: [], currentPage: 1, paging: {},totaltime:0,latestDate:'' }


        this.onChangeDate = this.onChangeDate.bind(this)
        this.onYearChange = this.onYearChange.bind(this)
        this.fetchData = this.fetchData.bind(this)
        this.calcNewDate = this.calcNewDate.bind(this)
        this.updateData = this.updateData.bind(this)
        this.onChangeMonth = this.onChangeMonth.bind(this)
        this.handlePagination = this.handlePagination.bind(this)
    }

    //****************************************************************************************************************************************

    componentDidMount() {
        const mon = (parseInt(this.state.currentMonth) + 1).toString();
        const dt = this.state.currentYear + '-' + mon + '-' + this.state.currentDay
        this.fetchData(dt)
    }

     //****************************************************************************************************************************************

    updateData() {        // callback จาก DailyTimesheet insert dts
        //console.log(this.state.jsonalldata)
        //console.log('updateData:' + JSON.stringify(dataIn,null,2))
        //const currentArray = this.state.jsonalldata
        //const newArray = currentArray.push(dataIn)
        const mon = (parseInt(this.state.currentMonth) + 1).toString();
        const dt = this.state.currentYear + '-' + mon + '-' + this.state.currentDay
        this.fetchData(dt)
    }

    //****************************************************************************************************************************************

    handlePagination(pagenum) {

        const totalpage = this.state.totalPage
        if (pagenum < 1) {
            pagenum = 1
        }
        else if (pagenum > totalpage) {
            pagenum = totalpage
        }

        this.setState({ currentPage: pagenum }, function () {
            const mon = (parseInt(this.state.currentMonth) + 1).toString();
            const dt = this.state.currentYear + '-' + mon + '-' + this.state.currentDay
            this.fetchData(dt)
        })
    }

    //****************************************************************************************************************************************

     handleErrors(response) {
         if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
     }

    async fetchData(dt) {

        const webapiurl = await axios.get('api/ConfigFromAppSetting')
        const startdate = dt + ' 00:00:00'
        const stopdate = dt + ' 23:59:59'


        Promise.all([
            //auth.fetchWithToken(webapiurl.data + '/api/v1/TransDtsDescs/Daily?datetime=' + startdate, "method:'GET'"),
            auth.fetchWithToken(webapiurl.data + '/api/v1/TransDtsDescs/page/?datestart=' + startdate + '&datestop=' + stopdate + '&PageNumber=' + this.state.currentPage + '&PageSize=10', "method:'GET'"),
            auth.fetchWithToken(webapiurl.data + '/api/v1/TransDtsDescs/Monthly?datetime=' + startdate, "method:'GET'"),
        ])
            .then(([data1, data2]) => this.setState({
                jsondata: data1.data.items,
                paging: data1.data.paging,
                totaltime: data1.data.totalTime.totaltimeValue,
                latestDate: data1.data.latestDate.latestDate,
                jsonalldata: data2.data
            }))
            .catch(error => console.log(error));
        
    }

    //****************************************************************************************************************************************

    calcNewDate() {
       
        const mon = (parseInt(this.state.currentMonth) + 1).toString();
        const newdt = this.state.currentYear + '-' + mon + '-' + this.state.currentDay

        this.fetchData(newdt)
    }

    //****************************************************************************************************************************************

    onChangeMonth(event) {
        const target = event.target
        const value = target.value
        const feb = new Date(this.state.currentYear, 2, 0)
        const lastDayFeb = feb.getDate()
        let curDay = this.state.currentDay


        if (curDay == '31' && (value == '3' || value == '5' || value == '8' || value == '10')) {
            curDay = '1'
        }
        else if (value == '1' && parseInt(curDay) > parseInt(lastDayFeb)) {
            curDay = '1'
        }
        
        this.setState({
            currentMonth: value, currentDay: curDay
        }, () => this.calcNewDate())
    }

    //****************************************************************************************************************************************

    onChangeDate(event) {
        
        const target = event.target
        const value = target.value

        const dayindex = target.getAttribute('dayindex')
        let curMonth = this.state.currentMonth
        let curYear = this.state.currentYear
        
        
        if (dayindex) {
            if (dayindex.substring(0, 2) == 'lm') {
                if (curMonth == 0) {
                    curYear = parseInt(curYear) - 1
                    curMonth = 11
                }
                else {
                    curMonth = parseInt(curMonth) - 1
                }
            }
            else if (dayindex.substring(0, 2) == 'nm') {
                if (curMonth == 11) {
                    curYear = parseInt(curYear) + 1
                    curMonth = 0
                }
                else {
                    curMonth = parseInt(curMonth) + 1
                }
            }
        }

        this.setState({
            currentYear: curYear, currentMonth: curMonth, currentDay: value
        }, () => this.calcNewDate())
        
}

    //****************************************************************************************************************************************

    onYearChange(event) {
        let temp;
        if (event.currentTarget.name == 'currentYearPrev') {
            temp = parseInt(event.currentTarget.value) - 1
        }
        else if (event.currentTarget.name == 'currentYearNext') {
            temp = parseInt(event.currentTarget.value) + 1
        }

        this.setState({ currentYear: temp }, () => this.calcNewDate())
    }

    //****************************************************************************************************************************************

    render() {

        let startStopDate = new Date(this.state.currentYear, this.state.currentMonth, this.state.currentDay)
        const tdy = new Date()
        tdy.setHours(0, 0, 0, 0)
        var minDate = subDays(tdy, 7) // แก้โชปุ่ม + ตรงนี้ ย้อนหลังกี่วัน
        let disableDate = false

        if (startStopDate > tdy || startStopDate < minDate) {
            disableDate = true
        }

        return (
            
            <div style={{ margin: '10px', overflowX: 'hidden' }}>
                <Row>
                    <Col lg="4" md="12" sm="12">
                        <DailyTimeSheet
                            disableDate={disableDate}
                            currentYear={this.state.currentYear}
                            currentDay={this.state.currentDay}
                            currentMonth={this.state.currentMonth}
                            jsondata={this.state.jsondata}
                            latestDate={this.state.latestDate}
                            updateData={this.updateData}
                        />
                            
                    </Col>
                    <Col lg="7" md="12" sm="12">
                        <MainCalendar currentYear={this.state.currentYear}
                            currentDay={this.state.currentDay}
                            currentMonth={this.state.currentMonth}
                            onChangeDate={this.onChangeDate}
                            onYearChange={this.onYearChange}
                            jsondata={this.state.jsondata}
                            jsonalldata={this.state.jsonalldata}
                            onChangeMonth={this.onChangeMonth} />
                    </Col>

                </Row>

                <Row>
                    <Col lg={{ size: 7, offset: 4 }}>
                        <ActivityDetail
                            disableDate={disableDate}
                            currentYear={this.state.currentYear}
                            currentDay={this.state.currentDay}
                            currentMonth={this.state.currentMonth}
                            jsondata={this.state.jsondata}
                            updateData={this.updateData}
                            handlePagination={this.handlePagination}
                            currentPage={this.state.currentPage}
                            paging={this.state.paging}
                            totaltime={this.state.totaltime}
                        />
                    </Col>
                </Row>
            </div>
        );
    }

    //****************************************************************************************************************************************

}