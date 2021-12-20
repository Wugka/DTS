import React, { Component } from 'react'
import { Row, Col, Table, Modal } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment from 'moment'
import swal from 'sweetalert'
import axios from 'axios'
import AuthService from '../AuthService'
import AddEditForm from '../AddEditForm'
import '../../css/TableResult.css'
import PaginationDts from '../componentsReuse/PaginationDts'
import { Scrollbars } from 'react-custom-scrollbars';
import CalcEtc from '../CalcEtc'
import ProjectModal from '../componentsReuse/ProjectModal'
import TimeModal from '../componentsReuse/TimeModal'
import DetailModal from '../componentsReuse/DetailModal'
import subDays from 'date-fns/subDays';

var auth = new AuthService()
var calc = new CalcEtc()

export default class TableResultAH extends Component {
    constructor() {
        super()
        this.state = {
            startDate: '', startTime: '8:30', endTime: '8:30', endDate: '', dtsNo: '', projectId: '', projectName: 'ทั้งหมด', projectCode: '',
            taskId: '', taskType: 'กรุณาเลือกประเภทงาน', detail: '', remark: '', lunchBreak: true, showModal: true, editClick: false, empId: 1
            , startClockFocus: false, endClockFocus: false, deleteId: -1, editId: -1, lunchLock: true, showModalDetail: false, showModalProject: false, showModalTime: false, clickitem: {}

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
        this.onFocusChange = this.onFocusChange.bind(this)

        this.handleModalClickDetail = this.handleModalClickDetail.bind(this)
        this.handleModalClickProject = this.handleModalClickProject.bind(this)
        this.handleModalClickTime = this.handleModalClickTime.bind(this)
    }

    //************************************************************************************************************************************

    onFocusChange(status, name) {                    //reset ค่า clockFocus เวลา loose focus จะset กลับเป็น False เพื่อ focusChange จะได้เปลี่ยนจาก False เป็น true เปิดปิด ปกติ เมื่อ มีการคลิกนอก นาฬิกา

        this.setState({ [name]: false })
    }

    handleFocusedChange(name, status) {

        this.setState({ [name]: !status })
    }

    handleModalClickDetail(item) {
        this.setState(prevState => ({ showModalDetail: !prevState.showModalDetail, clickitem: item }))
    }

    handleModalClickProject(item) {
        this.setState(prevState => ({ showModalProject: !prevState.showModalProject, clickitem: item }))
    }

    handleModalClickTime(item) {
        this.setState(prevState => ({ showModalTime: !prevState.showModalTime, clickitem: item }))
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
            const startDateTime = new Date(this.state.startDate.getFullYear(), this.state.startDate.getMonth(), this.state.startDate.getDate(), startTimeArray[0], startTimeArray[1])
            const endDateTime = new Date(this.state.endDate.getFullYear(), this.state.endDate.getMonth(), this.state.endDate.getDate(), endTimeArray[0], endTimeArray[1])

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
        this.setState({ showModal: false, editId: -1 })
    }

    handleEdit(item, index) {
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
            startClockFocus: false, endClockFocus: false, editId: index, lunchLock: lock
        })
    }

    //************************************************************************************************************************************

    async handleDelete(dtsno, cb, index, pcode) {
        this.setState({ deleteId: index })
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
                            this.setState({ deleteId: -1 })
                        })
                    break;

                default: this.setState({ deleteId: -1 })
            }
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
                else {
                    swal({ text: 'ไม่่สามารถแก้ไขข้อมูลได้', icon: 'warning' })
                }
            }).catch(error => {
                if (error.response && error.response.data && error.response.data.message) {
                    swal({ text: error.response.data.message, icon: 'warning' })
                }
                else {
                    swal({ text: 'ไม่่สามารถแก้ไขข้อมูลได้', icon: 'warning' })
                }

            })
    }

    //************************************************************************************************************************************

    render() {
        const dtsdataArray = []

        this.props.jsondata.length ? this.props.jsondata.map((item, i) => {
            const startdt = item.dtsStartDate
            const startdtsplit = startdt.split('T') // 2020-02-03  |  T  | 08:30:00 // new Date(item.dtsStartDate) ใน ios + 7 GMT หาวิธีแก้ไม่ได้ เลยsplit เอา 
            const startDateSplit = startdtsplit[0].split('-') // 2020 | 02 | 03
            const mon = parseInt(startDateSplit[1]) - 1
            const startDateTime = new Date(startDateSplit[0], mon, startDateSplit[2], 0, 0)

            const tdy = new Date()
            tdy.setHours(0, 0, 0, 0)
            var minDate = subDays(tdy, 7)

            let deletebtn = this.state.deleteId == i ? <FontAwesomeIcon onClick={() => this.handleDelete(item.dtsNo, this.props.fetchData, i)} icon={['far', 'dot-circle']} size='lg' style={{ color: "red", cursor: 'pointer' }} />
                         : <FontAwesomeIcon onClick={() => this.handleDelete(item.dtsNo, this.props.fetchData, i, item.project.projCode)} icon={['far', 'circle']} size='lg' style={{ color: "red", cursor: 'pointer' }} />
            
            let editbtn = item.dtsLeadApprove === 1 ? <FontAwesomeIcon icon={['far', 'circle']} size='lg' style={{ color: "red", cursor: 'no-drop' }} />
                         :
                         this.state.editId == i ? <FontAwesomeIcon onClick={() => this.handleEdit(item, i)} icon={['far', 'dot-circle']} size='lg' style={{ color: "red", cursor: 'pointer' }} />
                         : <FontAwesomeIcon onClick={() => this.handleEdit(item, i)} icon={['far', 'circle']} size='lg' style={{ color: "red", cursor: 'pointer' }} />
            
            const newFormatStartDt = moment(item.dtsStartDate).format('DD/MM/YYYY HH:mm')
            const newFormatStopDt = moment(item.dtsStopDate).format('DD/MM/YYYY HH:mm')

            let totaltime = item.totaltime
            if (totaltime === '1.00:00:00') {
                totaltime = '24:00'
            }
            else if (totaltime.toString().charAt(0) === '0') {
                totaltime = totaltime.toString().slice(1)
            }

            const totaltimesplit = totaltime.split(':')
            const dailyHrs = totaltimesplit[0] + ':' + totaltimesplit[1]

            let selectedrow = 'white'
            if (this.state.deleteId == i || this.state.editId == i) {
                selectedrow = 'red'
            }

            if (startDateTime < minDate) {
                deletebtn = <FontAwesomeIcon icon={['far', 'circle']} size='lg' style={{ color: "red", cursor: 'no-drop' }} />
                editbtn = <FontAwesomeIcon icon={['far', 'circle']} size='lg' style={{ color: "red", cursor: 'no-drop' }} />
                selectedrow = 'grey'
            }

            dtsdataArray.push(
                <tr key={i} style={{ color: selectedrow }}>
                    <td name='delete'>
                        {deletebtn}
                    </td>
                    <td name='edit'>
                        {editbtn}

                    </td>
                    <td> {item.dtsLeadApprove ? <FontAwesomeIcon icon={['far', 'dot-circle']} size='lg' style={{ color: "red" }} /> : <FontAwesomeIcon icon={['far', 'circle']} size='lg' style={{ color: "red" }} />} </td>
                    <td> {newFormatStartDt} </td>
                    <td> {newFormatStopDt} </td>
                    <td onClick={() => this.handleModalClickProject(item)} style={{ cursor: 'pointer' }}> {item.project.projCode} </td>
                    <td> {item.taskType.taskType} </td>
                    <td onClick={() => this.handleModalClickDetail(item)} style={{ cursor: 'pointer', maxWidth: '230px' }}> <Scrollbars autoHeight> <p style={{ whiteSpace: 'pre-line', textAlign: 'left' }}> {item.dtsTaskDesc} </p> </Scrollbars> </td>
                    <td onClick={() => this.handleModalClickTime(item)} style={{ cursor: 'pointer' }}> {dailyHrs} </td>
                    <td style={{ maxWidth: '230px' }}> <Scrollbars autoHeight> <p style={{ whiteSpace: 'pre-line', textAlign: 'left' }}>  {item.dtsRemark} </p> </Scrollbars> </td>
                </tr>
            )

        }) : dtsdataArray.push(<tr key={1}><td colSpan='10' style={{ textAlign: 'center', color: 'white' }}>ไม่พบข้อมูล</td></tr>)

        let totalHrs = this.props.totaltime

        if (totalHrs.toString().charAt(0) === '0') {
            totalHrs = totalHrs.toString().slice(1)
        }

        return (
            <React.Fragment>
                <Row>
                    <Col lg={{ size: '12' }}>
                        <div className='faltutable'>
                            <Table bordered className='tableresult' >
                                <thead>
                                    <tr style={{ color: 'white', textAlign: 'center', backgroundColor: '#1F3358', whiteSpace: 'nowrap' }}>
                                        <th>ลบ</th>
                                        <th>แก้ไข</th>
                                        <th>Lead</th>
                                        <th>วันที่-เวลา</th>
                                        <th>ถึงวันที่-เวลา</th>
                                        <th>รหัสโครงการ</th>
                                        <th>ประเภทงาน</th>
                                        <th>รายละเอียด</th>
                                        <th>เวลาที่ใช้(ชม.)</th>
                                        <th>หมายเหตุ</th>
                                    </tr>
                                </thead>
                                <tbody style={{ textAlign: 'center' }}>
                                    {dtsdataArray}
                                </tbody>
                            </Table>
                        </div>
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
                        <p style={{ textAlign: 'right', color: 'white' }}>Total {this.props.paging.totalItems} Records / Actual Effort {totalHrs} MH</p>

                        <PaginationDts handlePagination={this.props.handlePagination}
                            paging={this.props.paging}
                            currentPage={this.props.currentPage}
                        />

                    </Col>
                </Row>

                <Modal contentClassName='reviewdocmodal' isOpen={this.state.showModalDetail} toggle={this.handleModalClickDetail}>
                    {this.state.showModalDetail && <DetailModal click={this.handleModalClickDetail}
                        item={this.state.clickitem}
                    />}
                </Modal>

                <Modal contentClassName='reviewdocmodal' isOpen={this.state.showModalProject} toggle={this.handleModalClickProject}>
                    {this.state.showModalProject && <ProjectModal click={this.handleModalClickProject}
                        item={this.state.clickitem}
                    />}
                </Modal>

                <Modal contentClassName='reviewdocmodal' isOpen={this.state.showModalTime} toggle={this.handleModalClickTime}>
                    {this.state.showModalTime && <TimeModal click={this.handleModalClickTime}
                        item={this.state.clickitem}
                    />}
                </Modal>

            </React.Fragment>
        )
    }

}