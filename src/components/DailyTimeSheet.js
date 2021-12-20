import React, { Component, useState } from "react";
import "../css/DailyTimeSheet.css";
import ReviewDoc from "./ReviewDoc"
import dayData from '../dayData'
import '../css/dropdown.css'
import '../css/timekeeper.css'
import '../css/modalConfirm.css'
import swal from 'sweetalert'
import AddEditForm from './AddEditForm'
import axios from 'axios'
import AuthService from './AuthService'
import moment from 'moment'
import subDays from 'date-fns/subDays';
import CalcEtc from './CalcEtc'


var calc = new CalcEtc()


export default class DailyTimeSheet extends Component {

    constructor(props) {
        super(props)

        const now = new Date()

        this.state = {
            currentweekday: '', DateTimeNow: now, startDate: now, startTime: '8:30', endTime: '8:30', endDate: now, projectId: '', projectName: 'กรุณาเลือกรหัสโครงการ', taskId: '',
            taskType: 'กรุณาเลือกประเภทงาน', detail: '', remark: '', empId: 1, lunchBreak: false, showModal: false, startClockFocus: false, endClockFocus: false, lunchLock: false, btnConfirmLoading: false
        }

        this.handleDropdownChange = this.handleDropdownChange.bind(this)
        this.handleChange = this.handleChange.bind(this)        // Date && Time
        this.handleTextChange = this.handleTextChange.bind(this)
        this.handleLunchBreak = this.handleLunchBreak.bind(this)
        this.createTimesheetConfirm = this.createTimesheetConfirm.bind(this)
        this.closeModal = this.closeModal.bind(this)
        this.openModal = this.openModal.bind(this)
        this.handleTimeChange = this.handleTimeChange.bind(this)
        this.handleFocusedChange = this.handleFocusedChange.bind(this)

        this.onFocusChange = this.onFocusChange.bind(this)

    }

    //****************************************************************************************************************************************

    onFocusChange(status,name) {                    //reset ค่า clockFocus เวลา loose focus จะset กลับเป็น False เพื่อ focusChange จะได้เปลี่ยนจาก False เป็น true เปิดปิด ปกติ เมื่อ มีการคลิกนอก นาฬิกา
        this.setState({ [name]: false })
    }

    //****************************************************************************************************************************************

    componentWillMount() {
        this.calcDayWeekday(this.props.currentYear, this.props.currentMonth, this.props.currentDay)
    }

    //****************************************************************************************************************************************

    componentWillReceiveProps(nextProps) {
        if (this.props.currentYear != nextProps.currentYear || this.props.currentMonth != nextProps.currentMonth || this.props.currentDay != nextProps.currentDay)
            this.calcDayWeekday(nextProps.currentYear, nextProps.currentMonth, nextProps.currentDay)
    }

    //****************************************************************************************************************************************

    calcDayWeekday(year, month, day) {
        var now = new Date(year, month, day)
        var weekdayindex = now.getDay();
        var currentweekday;
        dayData.map(x => {
            if (x.index == weekdayindex) {
                currentweekday = x.fday
            }
        })

        this.setState({ currentweekday: currentweekday })

    }

    //****************************************************************************************************************************************

    async createTimesheetConfirm(evt) {
        const auth = new AuthService()
        const profile = auth.getProfile()
        const empid = profile.nameid

        const startTimeArray = this.state.startTime.split(':')
        const endTimeArray = this.state.endTime.split(':')
        const newStartDateTime = new Date(this.state.startDate.getFullYear(), this.state.startDate.getMonth(), this.state.startDate.getDate(), startTimeArray[0], startTimeArray[1])
        const newEndDateTime = new Date(this.state.endDate.getFullYear(), this.state.endDate.getMonth(), this.state.endDate.getDate(), endTimeArray[0], endTimeArray[1])

        const pickedStartTime = newStartDateTime.toISOString()
        const pickedEndTime = newEndDateTime.toISOString()

        if (moment().isBefore(pickedStartTime) === true) {
            swal({ text: 'เวลาเริ่มต้นไม่สามารถเกินเวลาปัจจุบันได้', icon: 'warning' })
            return
        }
        else if (moment().isBefore(pickedEndTime) === true) {
            swal({ text: 'เวลาสิ้นสุดไม่สามารถเกินเวลาปัจจุบันได้', icon: 'warning' })
            return
        }
        else if (this.state.projectId == '' || this.state.taskId == '') {
            swal({ text: 'กรุณากรอกข้อมูลให้ครบถ้วน', icon: 'warning' })
            return
        }
        else if (newEndDateTime < newStartDateTime) {
            swal({ text: 'วันเวลาเริ่มต้นต้องน้อยกว่าเวลาสิ้นสุด', icon: 'warning' })
            return
        }
        else if (newStartDateTime.getTime() === newEndDateTime.getTime()) {
            swal({ text: 'วันเวลาเริ่มต้นและวันเวลาสิ้นสุดต้องไม่เท่ากัน', icon: 'warning' })
            return
        }

        let timeDif = (Math.abs(newEndDateTime - newStartDateTime) / 36e5)
        let lb = 1

        if (this.state.lunchBreak === false) {
            lb = 0
        }
        else if (this.state.lunchBreak === true) {
            timeDif = timeDif - 1
        }

        if (parseFloat(timeDif) > 24.00) {
            swal({ text: 'วันเวลาเริ่มต้น และ วันเวลาสิ้นสุด ต้องไม่เกิน 24 ช.ม.', icon: 'warning' })
            return
        }

        const webapiurl = await axios.get('api/ConfigFromAppSetting')
        const jsondata = {
            ProjId: this.state.projectId,
            TaskId: this.state.taskId,
            EmpId: empid,   //ชั่วคราวยังไม่มีlogin
            DtsTaskDesc: this.state.detail,
            DtsRemark: this.state.remark,
            DtsStartDate: newStartDateTime,
            DtsStopDate: newEndDateTime,
            DtsStampDate: this.state.DateTimeNow,
            DtsBreak: lb,
        }

            this.setState({ btnConfirmLoading: true })
            auth.fetchWithToken(webapiurl.data + '/api/v1/TransDtsDescs', { method: 'POST', data: jsondata })
            .then(response => {
                if (auth._IsSuccessResponse(response) === true) {
                    this.setState({btnConfirmLoading: false})
                    swal({ text: 'เพิ่มข้อมูลสำเร็จ', icon: 'success' })
                    evt()
                    this.closeModal()
                }
                }).catch(error => {
                    this.setState({btnConfirmLoading: false})
                    if (error.response && error.response.data && error.response.data.message) {
                        swal({ text: error.response.data.message, icon: 'warning' })
                    }
                    else {
                        swal({ text: 'ไม่สามารถเพิ่มข้อมูลได้', icon: 'warning' })
                    }

            })

            //axios(webapiurl.data + '/api/v1/TransDtsDescs', { headers, method: 'POST', data: jsondata })
            //    .then(response => {
            //        if (auth._IsSuccessResponse(response) === true) {
            //            swal({ text: 'เพิ่มข้อมูลสำเร็จ', icon: 'success' })
            //            evt()
            //            this.closeModal()
            //        }
            //    }).catch(error => {
            //        if (error.response && error.response.data && error.response.data.message) {
            //            swal({ text: error.response.data.message, icon: 'warning' })
            //        }
            //        else {
            //            swal({ text: 'ไม่สามารถเพิ่มข้อมูลได้', icon: 'warning' })
            //        }
                    
            //    })


    }

    //****************************************************************************************************************************************

    handleFocusedChange(name, status) {
        this.setState({ [name]: !status }, function () {
        })
    }

    handleDropdownChange(e,name) {
        let value = e.value
        let label = e.label

        if (name === 'project') {
            this.setState({
                projectName: label,
                projectId: value
            })
        }
        else if (name === 'task') {
            this.setState({
                taskType: label,
                taskId: value
            })
        }

        //const event = e.currentTarget
        //const value = event.getAttribute('value')
        //const name = event.getAttribute('name')
        //const idname = event.getAttribute('idname')
        //const idval = event.getAttribute('id')

        //this.setState({
        //    [name]: value,
        //    [idname]: idval
        //})
    }

    handleTimeChange(options,name) {
        const newtime = options.hour + ":" + options.minute
        this.setState({ [name]: newtime }, function () {
            const startTimeArray = this.state.startTime.split(':')
            const endTimeArray = this.state.endTime.split(':')
            const startDateTime = new Date(this.state.startDate.getFullYear(), this.state.startDate.getMonth(), this.state.startDate.getDate(), startTimeArray[0], startTimeArray[1])
            const endDateTime = new Date(this.state.endDate.getFullYear(), this.state.endDate.getMonth(), this.state.endDate.getDate(), endTimeArray[0], endTimeArray[1])

            const lock = calc.getLunchLockStatus(startDateTime, endDateTime)
            this.setState({ lunchLock: lock })
        })
    }

    handleChange(dataIn, name) {
        this.setState({
            [name]: dataIn,
        }, function () {
            const startTimeArray = this.state.startTime.split(':')
            const endTimeArray = this.state.endTime.split(':')
            let startDateTime = new Date(this.state.startDate.getFullYear(), this.state.startDate.getMonth(), this.state.startDate.getDate(), startTimeArray[0], startTimeArray[1])
            let endDateTime = new Date(this.state.endDate.getFullYear(), this.state.endDate.getMonth(), this.state.endDate.getDate(), endTimeArray[0], endTimeArray[1])

            const lock = calc.getLunchLockStatus(startDateTime, endDateTime)
            this.setState({lunchLock: lock})

        })
    }

    handleTextChange(evt) {
        const name = evt.target.name
        const value = evt.target.value

        this.setState({
            [name]: value,
        });
    }

    handleLunchBreak() {
        this.setState({ lunchBreak: !this.state.lunchBreak })
    }

    closeModal() {
        this.setState({ showModal: false })
    }

    openModal() {
        let startStopDate = new Date(this.props.currentYear, this.props.currentMonth, this.props.currentDay)
        const tdy = new Date()
        tdy.setHours(0, 0, 0, 0)
        var minDate = subDays(tdy, 7)


        if (startStopDate > tdy || startStopDate < minDate) {
            startStopDate = tdy
        }
       
        this.setState({
            startDate: startStopDate, startTime: '8:30', endTime: '8:30', endDate: startStopDate, projectId: '', projectName: 'กรุณาเลือกรหัสโครงการ', taskId: '', taskType: 'กรุณาเลือกประเภทงาน',
            detail: '', remark: '', lunchBreak: false, showModal: true, startClockFocus: false, endClockFocus: false, lunchLock:true
        })
    }

    //****************************************************************************************************************************************

    render() {

        const ThisDayColor = () => {
            let wkday = this.state.currentweekday
            let htmlday = ''
            let daycolor = {}
            htmlday = wkday.split(/(MON|TUES|WEDNES|THURS|FRI|SATUR|SUN)/)

            if (htmlday[1] == 'MON') {
                daycolor = { color: '#E6D73D' }
            } else if (htmlday[1] == 'TUES') {
                daycolor = { color: '#DE80A8' }
            } else if (htmlday[1] == 'WEDNES') {
                daycolor = { color: '#81B752' }
            } else if (htmlday[1] == 'THURS') {
                daycolor = { color: '#F15A24' }
            } else if (htmlday[1] == 'FRI') {
                daycolor = { color: '#87CBFF' }
            } else if (htmlday[1] == 'SATUR') {
                daycolor = { color: '#526AB2' }
            } else if (htmlday[1] == 'SUN') {
                daycolor = { color: '#ED1E24' }
            }

            htmlday[1] = <span key='1' style={daycolor}>{htmlday[1]}</span>

            return <div className="day"> {htmlday} </div>;
        };

        const cday = ('0' + this.props.currentDay).slice(-2)

        return (
            <div>
                <div className="calendar-left">
                    <div className="num-date">{cday}</div>
                    <ThisDayColor />
                    <ReviewDoc jsondata={this.props.jsondata} />
                 
                    <AddEditForm stateinfo={this.state}
                        disableDate={this.props.disableDate}
                        handleDropdownChange={this.handleDropdownChange}
                        handleChange={this.handleChange}
                        handleTextChange={this.handleTextChange}
                        handleLunchBreak={this.handleLunchBreak}
                        createTimesheetConfirm={this.createTimesheetConfirm}
                        closeModal={this.closeModal}
                        openModal={this.openModal}
                        updateData={this.props.updateData}
                        modalname='add'
                        handleTimeChange={this.handleTimeChange}
                        handleFocusedChange={this.handleFocusedChange}
                        startClockFocus={this.state.startClockFocus}
                        endClockFocus={this.state.endClockFocus}
                        onFocusChange={this.onFocusChange}
                    />
                </div>

            </div>
        );

    }

}
