import React, { Component } from "react";
import { Table, Modal } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'reactstrap'
import swal from 'sweetalert'
import AddEditForm from './AddEditForm'
import axios from 'axios'
import AuthService from "./AuthService";
import moment from 'moment'
import '../css/sweetalert.css'
import { Scrollbars } from 'react-custom-scrollbars';
import DetailModal from './componentsReuse/DetailModal'
import PaginationDts from './componentsReuse/PaginationDts'
import CalcEtc from './CalcEtc'
import '../css/slimscroll.css'

var calc = new CalcEtc()
var auth = new AuthService()

export default class ActivityDetail extends Component {

    constructor() {
        super()
        this.state = {
            startDate: '', startTime: '8:30', endTime: '8:30', endDate: '', dtsNo: '', projectId: '', projectName: 'กรุณาเลือกรหัสโครงการ', projectCode: '',
            taskId: '', taskType: 'กรุณาเลือกประเภทงาน', detail: '', remark: '', lunchBreak: true, showModal: true, editClick: false, empId: 1, startClockFocus: false, endClockFocus: false, lunchLock: true,
            showModalDetail: false, clickitem: {}
        }
        this.handleDelete = this.handleDelete.bind(this)
        this.handleEdit = this.handleEdit.bind(this)

        this.handleDropdownChange = this.handleDropdownChange.bind(this)
        this.handleChange = this.handleChange.bind(this)        // Date && Time
        this.handleTextChange = this.handleTextChange.bind(this)
        this.handleLunchBreak = this.handleLunchBreak.bind(this)
        this.closeModal = this.closeModal.bind(this)
        this.editTimesheetConfirm = this.editTimesheetConfirm.bind(this)
        this.handleTimeChange = this.handleTimeChange.bind(this)
        this.handleFocusedChange = this.handleFocusedChange.bind(this)
        this.handleModalClick = this.handleModalClick.bind(this)

        this.onFocusChange = this.onFocusChange.bind(this)
    }

    //****************************************************************************************************************************************

    onFocusChange(status, name) {                    //reset ค่า clockFocus เวลา loose focus จะset กลับเป็น False เพื่อ focusChange จะได้เปลี่ยนจาก False เป็น true เปิดปิด ปกติ เมื่อ มีการคลิกนอก นาฬิกา
        this.setState({ [name]: false })
    }

    //****************************************************************************************************************************************

    handleFocusedChange(name, status) {
        this.setState({ [name]: !status })
    }

    //****************************************************************************************************************************************

    handleDropdownChange(e, name) {
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

    handleChange(dataIn, name) {
        this.setState({
            [name]: dataIn,
        }, function () {
            const startTimeArray = this.state.startTime.split(':')
            const endTimeArray = this.state.endTime.split(':')
            let startDateTime = new Date(this.state.startDate.getFullYear(), this.state.startDate.getMonth(), this.state.startDate.getDate(), startTimeArray[0], startTimeArray[1])
            let endDateTime = new Date(this.state.endDate.getFullYear(), this.state.endDate.getMonth(), this.state.endDate.getDate(), endTimeArray[0], endTimeArray[1])

            const lock = calc.getLunchLockStatus(startDateTime, endDateTime)
            this.setState({ lunchLock: lock })

        })
    }

    handleTimeChange(options, name) {
        const newtime = options.hour + ":" + options.minute
        this.setState({ [name]: newtime }, function () {
            const startTimeArray = this.state.startTime.split(':')
            const endTimeArray = this.state.endTime.split(':')
            let startDateTime = new Date(this.state.startDate.getFullYear(), this.state.startDate.getMonth(), this.state.startDate.getDate(), startTimeArray[0], startTimeArray[1])
            let endDateTime = new Date(this.state.endDate.getFullYear(), this.state.endDate.getMonth(), this.state.endDate.getDate(), endTimeArray[0], endTimeArray[1])

            const lock = calc.getLunchLockStatus(startDateTime, endDateTime)
            this.setState({ lunchLock: lock })
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

    //************************************************************************************************************************************

    async handleDelete(dtsno, cb, pcode) {

        const webapiurl = await axios.get('api/ConfigFromAppSetting')
        swal({
            title: 'ยืนยันการลบข้อมูล',
            text: 'รหัสโครงการ :' + pcode,
            buttons: {
                ok: 'ตกลง',
                cancel: 'ยกเลิก'
            }
        }).then((value) => {

            switch (value) {
                case 'ok':
                    auth.fetchWithToken(webapiurl.data + '/api/v1/TransDtsDescs/' + dtsno, { method: 'DELETE' })
                        .then(response => {

                            if (auth._IsSuccessResponse(response)) {
                                swal({ text: 'ลบข้อมูลสำเร็จ', icon: 'success' })
                                cb()
                            }
                            else {
                                swal({ text: 'ไม่สามารถลบข้อมูลได้', icon: 'warning' })
                            }
                        })
                    break;

                default: ''
            }

            }).catch(err => {
                swal({ text: 'ไม่สามารถลบข้อมูลได้', icon: 'warning' })
            })

        
    }

    //************************************************************************************************************************************

    async editTimesheetConfirm(evt) {
        const profile = auth.getProfile()
        const empid = profile.nameid

        const now = new Date()
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

        if (this.state.lunchLock === true) {
            lb = 0
        }
        else {
            if (this.state.lunchBreak === false) {
                lb = 0
            }
            else if (this.state.lunchBreak === true) {
                timeDif = timeDif - 1
            }
        }


        if (parseFloat(timeDif) > 24.00) {
            swal({ text: 'วันเวลาเริ่มต้น และ วันเวลาสิ้นสุด ต้องไม่เกิน 24 ช.ม.', icon: 'warning' })
            return
        }

        //console.log('Edit: ' + 'pid:' + this.state.projectId + ',tid: ' + this.state.taskId + ',tdesc: ' + this.state.detail + ',remark:' + this.state.remark + ',sdate:' + newStartDateTime + ',edate: ' + newEndDateTime + ',stamp:' + now + ',dtsno:' + this.state.dtsNo)
        const webapiurl = await axios.get('api/ConfigFromAppSetting')
        const jsondata = JSON.stringify({
            DtsNo: this.state.dtsNo,
            ProjId: this.state.projectId,
            TaskId: this.state.taskId,
            EmpId: empid,   //ชั่วคราวยังไม่มีlogin
            DtsTaskDesc: this.state.detail,
            DtsRemark: this.state.remark,
            DtsStartDate: newStartDateTime,
            DtsStopDate: newEndDateTime,
            DtsStampDate: now,
            DtsBreak: lb,
        })

        auth.fetchWithToken(webapiurl.data + '/api/v1/TransDtsDescs', { method: 'PUT', data: jsondata })
            .then(response => {
                if (auth._IsSuccessResponse(response)) {
                    swal({ text: 'แก้ไขข้อมูลสำเร็จ', icon: 'success' })
                    evt()
                    this.closeModal()
                }
            }).catch(error => {
                if (error.response && error.response.data && error.response.data.message) {
                    swal({ text: error.response.data.message, icon: 'warning' })
                }
                else {
                    swal({ text: 'ไม่สามารถแก้ไขข้อมูลได้', icon: 'warning' })
                }
               
            })
    }

    //************************************************************************************************************************************

    handleEdit(item) {
        const startdt = item.dtsStartDate
        const stopdt = item.dtsStopDate
        const startdtsplit = startdt.split('T') // 2020-02-03  |  T  | 08:30:00 // new Date(item.dtsStartDate) ใน ios + 7 GMT หาวิธีแก้ไม่ได้ เลยsplit เอา 
        const stopdtsplit = stopdt.split('T') 

        const currentStartDate = new Date(startdtsplit[0])
        const currentEndDate = new Date(stopdtsplit[0])

        const currentStartTime = moment(item.dtsStartDate).format('HH:mm')
        const curretEndTime = moment(item.dtsStopDate).format('HH:mm')
        const projectWithCode = item.project.projCode + ' ' + item.project.projName

        let lb = false

        const lock = calc.getLunchLockStatusForEdit(item.dtsStartDate, item.dtsStopDate)

        if (lock === false) {
            if (item.dtsBreak == 0) {
                lb = false
            }
            else {
                lb = true
            }
        }

        this.setState({
            startDate: currentStartDate, startTime: currentStartTime, endTime: curretEndTime, endDate: currentEndDate, projectId: item.project.projId, projectCode: item.project.projCode,
            projectName: projectWithCode, taskId: item.taskType.taskId, taskType: item.taskType.taskType, detail: item.dtsTaskDesc, remark: item.dtsRemark, lunchBreak: lb, showModal: true, editClick: true, dtsNo: item.dtsNo,
            startClockFocus: false, endClockFocus: false, lunchLock:lock
        })
    }

    //************************************************************************************************************************************

    handleModalClick(item) {
        this.setState(prevState => ({ showModalDetail: !prevState.showModalDetail,clickitem:item }))
    }

    //************************************************************************************************************************************

    render() {
        const adcArray = []
        let isNextDayExist = false

        this.props.jsondata.length ? this.props.jsondata.map((item, index) => {
            const startdayString = moment(item.dtsStartDate).format('L')  // MM/DD/YYYY
            const stopdayString = moment(item.dtsStopDate).format('L')
            const startday = startdayString.split('/')[1]
            const stopday = stopdayString.split('/')[1]
            let isNextDay = false
            
            if (startday != stopday && moment(item.dtsStartDate).isBefore(moment(item.dtsStopDate))) {
                isNextDay = true
                if (!isNextDayExist) {
                    isNextDayExist = true
                }
            }

            const startime = moment(item.dtsStartDate).format('HH:mm')
            const stoptime = moment(item.dtsStopDate).format('HH:mm')

            let totaltime = item.totaltime
            if (totaltime === '1.00:00:00') {
                totaltime = '24:00'
            }
            else if (totaltime.toString().charAt(0) === '0') {
                totaltime = totaltime.toString().slice(1)
            }
            
            const totaltimesplit = totaltime.split(':')
            const dailyHrs = totaltimesplit[0] + ':' + totaltimesplit[1]
            
            adcArray.push(
                
                <tr key={index} style={{ color: 'white' }}>
                    <td> {item.dtsLeadApprove ? <FontAwesomeIcon icon={['far', 'dot-circle']} size='lg' style={{ color: "red" }} /> : <FontAwesomeIcon icon={['far', 'circle']} size='lg' style={{ color: "red" }} />} </td>
                    {/*<td> {item.dtsSmApprove ? <FontAwesomeIcon icon={['far', 'dot-circle']} style={{ color: "red" }} /> : <FontAwesomeIcon icon={['far', 'circle']} style={{ color: "red" }} />} </td>*/}
                    <td onClick={() => this.handleModalClick(item)} style={{ cursor: 'pointer' }}> {item.project.projCode} </td>
                    <td style={{ whiteSpace: 'nowrap' }}> {startime} - {stoptime}{isNextDay ? <span style={{ fontSize: '13px', verticalAlign: 'top' }} > +1</span> : <span style={{ fontSize: '13px', visibility: 'hidden' }}> +1</span>} </td>
                    <td style={{ textAlign: 'left', maxWidth:'200px' }}>
                        <Scrollbars autoHeight>
                            <p style={{ whiteSpace:'pre-line' }}> {item.dtsTaskDesc} </p>
                        </Scrollbars>
                    </td>
                    <td> {dailyHrs} </td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                        {this.props.disableDate ? 
                            <Button size='sm' outline color="secondary" style={{ backgroundColor: 'transparent', color: 'grey', cursor:'no-drop', marginRight: '3px' }}>Edit</Button>
                            : <Button disabled={item.dtsLeadApprove === 1} size='sm' onClick={() => this.handleEdit(item)} outline color="danger" style={{ color: 'white', marginRight: '3px' }}>Edit</Button>}

                        {this.props.disableDate?
                            <Button size='sm' outline color="secondary" style={{backgroundColor:'transparent', color: 'grey', cursor:'no-drop' }}>Delete</Button>
                            : <Button size='sm' onClick={() => this.handleDelete(item.dtsNo, this.props.updateData, item.project.projCode)} outline color="danger" style={{ color: 'white' }}>Delete</Button>} 
                    </td>
                </tr>)


        }) : adcArray.push(<tr key={1}><td colSpan='10' style={{ textAlign: 'center', color: 'white' }}>ไม่พบข้อมูล</td></tr>)

        let totalHrs = this.props.totaltime

        if (totalHrs.toString().charAt(0) === '0') {
            totalHrs = totalHrs.toString().slice(1)
        }

        return (
            <React.Fragment>
                <div className='slimscrolltext faltutable'>
                <Table borderless>
                    <thead>
                        <tr style={{ color: 'white', textAlign: 'center', whiteSpace: 'nowrap', backgroundColor: '#1F3358', borderTop: '1px solid black', borderBottom:'1px solid black' }}>
                            <th>Lead</th>
                            {/*<th>SM</th>*/}
                            <th>Project ID</th>
                            <th style={{ paddingLeft:'0' }}>Time</th>
                            <th>Details</th>
                            <th>Sum(hr.)</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody style={{ textAlign: 'center' }}>
                        {adcArray}
                    </tbody>
                </Table>

                <Modal contentClassName='reviewdocmodal' isOpen={this.state.showModalDetail} toggle={this.handleModalClick}>
                    {this.state.showModalDetail && <DetailModal click={this.handleModalClick}
                        item={this.state.clickitem}
                    />}
                </Modal>

                {this.state.editClick ? <AddEditForm stateinfo={this.state}
                    handleDropdownChange={this.handleDropdownChange}
                    handleChange={this.handleChange}
                    handleTextChange={this.handleTextChange}
                    handleLunchBreak={this.handleLunchBreak}
                    editTimesheetConfirm={this.editTimesheetConfirm}
                    closeModal={this.closeModal}
                    updateData={this.props.updateData}
                    modalname='edit'
                    handleTimeChange={this.handleTimeChange}
                    handleFocusedChange={this.handleFocusedChange}
                    startClockFocus={this.state.startClockFocus}
                    endClockFocus={this.state.endClockFocus}
                    onFocusChange={this.onFocusChange}
                /> : ''}
                </div>
                <p style={{ textAlign: 'right', color: 'white' }}>Total {this.props.paging.totalItems} Records / Actual Effort {totalHrs} MH</p>
                
                <PaginationDts handlePagination={this.props.handlePagination}
                    paging={this.props.paging}
                    currentPage={this.props.currentPage}
                />

                {isNextDayExist ? <p style={{ textAlign: 'right', color: 'white', fontSize: '13px' }}> * +1หมายถึง วันถัดไป </p> : ''} 

            </React.Fragment>
        );

    }


}
