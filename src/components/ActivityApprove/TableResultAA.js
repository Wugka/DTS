import React, { Component } from 'react'
import { Row, Col, Modal, Table } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment from 'moment'
import AuthService from '../AuthService';
import axios from 'axios'
import EditFormAA from './EditFormAA'
import swal from 'sweetalert'
import PaginationDts from '../componentsReuse/PaginationDts'
import { Scrollbars } from 'react-custom-scrollbars';
import DetailModal from '../componentsReuse/DetailModal'
import CalcEtc from '../CalcEtc'
import ProjectModal from '../componentsReuse/ProjectModal'
import TimeModal from '../componentsReuse/TimeModal'

var auth = new AuthService()
var calc = new CalcEtc()

export default class TableResultAA extends Component {
    constructor() {
        super()
        this.state = {
            startDate: '', startTime: '8:30', endTime: '8:30', endDate: '', projectId: '', projectName: 'กรุณาเลือกรหัสโครงการ', taskId: '', taskType: 'กรุณาเลือกประเภทงาน', detail: '', remark: '',
            showModal: true, editClick: false, editId: -1, rowempid: '', leadApprove: 0, lunchBreak: '0', showModalDetail: false, showModalProject: false, showModalTime: false, clickitem: {},
            startClockFocus: false, endClockFocus: false
        }

        this.handleEdit = this.handleEdit.bind(this)
        this.handleTextChange = this.handleTextChange.bind(this)
        this.closeModal = this.closeModal.bind(this)
        this.editTimesheetConfirm = this.editTimesheetConfirm.bind(this)
        this.handleModalClickDetail = this.handleModalClickDetail.bind(this)
        this.handleModalClickProject = this.handleModalClickProject.bind(this)
        this.handleModalClickTime = this.handleModalClickTime.bind(this)
        this.onFocusChange = this.onFocusChange.bind(this)
        this.handleFocusedChange = this.handleFocusedChange.bind(this)
        this.handleTimeChange = this.handleTimeChange.bind(this)
        this.handleLunchBreak = this.handleLunchBreak.bind(this)
        this.handleDropdownChange = this.handleDropdownChange.bind(this)
    }

    //************************************************************************************************************************************

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

    handleLunchBreak() {
        this.setState({ lunchBreak: !this.state.lunchBreak })
    }

    handleFocusedChange(name, status) {
        this.setState({ [name]: !status }, function () {
        })
    }

    onFocusChange(status, name) {                   
        this.setState({ [name]: false })
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

    handleEdit(item, index) {
        const startdt = item.dtsStartDate
        const stopdt = item.dtsStopDate
        const startdtsplit = startdt.split('T') // 2020-02-03  |  T  | 08:30:00 // new Date(item.dtsStartDate) ใน ios + 7 GMT หาวิธีแก้ไม่ได้ เลยsplit เอา 
        const stopdtsplit = stopdt.split('T')
        const startDateSplit = startdtsplit[0].split('-') // 2020 | 02 | 03
        const startTimeSplit = startdtsplit[1].split(':') // 08 | 03 | 00
        const stopDateSplit = stopdtsplit[0].split('-')
        const stopTimeSplit = stopdtsplit[1].split(':')

        const currentStartDate = new Date(startdtsplit[0])
        const currentEndDate = new Date(stopdtsplit[0])
        const currentStartTime = moment(item.dtsStartDate).format('HH:mm')
        const curretEndTime = moment(item.dtsStopDate).format('HH:mm')
        const projectWithCode = item.project.projCode + ' ' + item.project.projName

        const startDateTime = new Date(startDateSplit[0], startDateSplit[1], startDateSplit[2], startTimeSplit[0], startTimeSplit[1])
        const endDateTime = new Date(stopDateSplit[0], stopDateSplit[1], stopDateSplit[2], stopTimeSplit[0], stopTimeSplit[1])
        const lock = calc.getLunchLockStatus(startDateTime, endDateTime)

        this.setState({
            startDate: currentStartDate,
            startTime: currentStartTime,
            endTime: curretEndTime,
            endDate: currentEndDate,
            projectId: item.project.projId,
            projectCode: item.project.projCode,
            projectName: projectWithCode,
            taskId: item.taskType.taskId,
            taskType: item.taskType.taskType,
            detail: item.dtsTaskDesc,
            remark: item.dtsRemark,
            lunchBreak: item.dtsBreak,
            showModal: true,
            editClick: true,
            dtsNo: item.dtsNo,
            editId: index,
            leadApprove: item.dtsLeadApprove,
            rowempid: item.empId,
            lunchLock: lock,
        })
    }

    //************************************************************************************************************************************

    async editTimesheetConfirm(evt) {
        const startTimeArray = this.state.startTime.split(':')
        const endTimeArray = this.state.endTime.split(':')
        const newStartDateTime = new Date(this.state.startDate.getFullYear(), this.state.startDate.getMonth(), this.state.startDate.getDate(), startTimeArray[0], startTimeArray[1])
        const newEndDateTime = new Date(this.state.endDate.getFullYear(), this.state.endDate.getMonth(), this.state.endDate.getDate(), endTimeArray[0], endTimeArray[1])
        let timeDif = (Math.abs(newEndDateTime - newStartDateTime) / 36e5)

        if (newEndDateTime < newStartDateTime) {
            swal({ text: 'วันเวลาเริ่มต้นต้องน้อยกว่าเวลาสิ้นสุด', icon: 'warning' })
            return
        }

        if (this.state.lunchBreak) {
            timeDif = timeDif - 1
        }
        
        if (parseFloat(timeDif) > 24.00) {
            swal({ text: 'วันเวลาเริ่มต้น และ วันเวลาสิ้นสุด ต้องไม่เกิน 24 ช.ม.', icon: 'warning' })
            return
        }

        let lunchBreak = 0
        if (this.state.lunchLock) {
            lunchBreak = 0
        }
        else if (this.state.lunchBreak) {
            lunchBreak = 1
        }


       
        const webapiurl = await axios.get('api/ConfigFromAppSetting')
        const jsondata = JSON.stringify({
            DtsNo: this.state.dtsNo,
            ProjId: this.state.projectId,
            EmpId: this.state.rowempid,
            TaskId: this.state.taskId,
            DtsTaskDesc: this.state.detail,
            DtsRemark: this.state.remark,
            DtsStartDate: newStartDateTime,
            DtsStopDate: newEndDateTime,
            DtsStampDate: new Date(),
            DtsBreak: lunchBreak,
            DtsLeadApprove: this.state.leadApprove,

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

    handleTextChange(evt) {
        const name = evt.target.name
        const value = evt.target.value

        this.setState({
            [name]: value,
        });
    }

    //************************************************************************************************************************************

    closeModal() {
        this.setState({ showModal: false, editId: -1 })
    }

    //************************************************************************************************************************************

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
    }

    //************************************************************************************************************************************

    render() {
        const dtsdataArray = []

        this.props.jsondata.length ? this.props.jsondata.map((item, i) => {
            const loginid = this.props.loginid

            const newFormatStartDt = moment(item.dtsStartDate).format('DD/MM/YYYY')
            //const startdate = new Date(item.dtsStartDate)
            //const stopdate = new Date(item.dtsStopDate)

            //let dailyMs = calc.calcTotalHour(startdate, stopdate, item.dtsBreak)
            //const hour = Math.floor((dailyMs / (1000 * 60 * 60)))
            //const minute = Math.floor((dailyMs / (1000 * 60)) % 60)
            //const dailyHrs = hour + ':' + ('0' + minute).slice(-2)

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
            let approveEditable

            if (item.employees.missionEmployees.employeesHead.empId != loginid) {
                selectedrow = 'grey'

                if (item.dtsLeadApprove === 1) {
                    approveEditable = <FontAwesomeIcon icon={['far', 'dot-circle']} size='lg' style={{ color: "red", cursor: 'no-drop' }} />

                }
                else {
                    approveEditable = <FontAwesomeIcon icon={['far', 'circle']} size='lg' style={{ color: "red", cursor: 'no-drop' }} />
                }
            }
            else {
                if (item.canApprove === false) {
                    approveEditable = <FontAwesomeIcon icon={['far', 'dot-circle']} size='lg' style={{ color: "red", cursor: 'no-drop' }} />
                }
                else {
                    if (item.dtsLeadApprove === 1) {
                        approveEditable = <FontAwesomeIcon icon={['far', 'dot-circle']} size='lg' style={{ color: "red", cursor: 'pointer' }} onClick={() => this.props.handleLead(item)} />

                    }
                    else {
                        approveEditable = <FontAwesomeIcon icon={['far', 'circle']} size='lg' style={{ color: "red", cursor: 'pointer' }} onClick={() => this.props.handleLead(item)} />
                    }
                }
            }

            let editDts = this.state.editId == i ? <FontAwesomeIcon onClick={() => this.handleEdit(item, i)} icon={['far', 'dot-circle']} size='lg' style={{ color: "red", cursor: 'pointer' }} /> :
                item.canApprove === false || item.employees.missionEmployees.employeesHead.empId != loginid ? <FontAwesomeIcon icon={['far', 'circle']} size='lg' style={{ color: "red", cursor: 'no-drop' }} /> :
                    <FontAwesomeIcon onClick={() => this.handleEdit(item, i)} icon={['far', 'circle']} size='lg' style={{ color: "red", cursor: 'pointer' }} />

            if (this.state.editId == i) {
                selectedrow = 'red'
            }

            dtsdataArray.push(
                <tr key={i} style={{ color: selectedrow }}>
                    <td name='edit'>
                        {editDts}
                    </td>
                    <td> {newFormatStartDt} </td>
                    <td style={{ textAlign: 'left' }}> {item.employees.empName} </td>
                    <td onClick={() => this.handleModalClickProject(item)} style={{ cursor: 'pointer' }}> {item.project.projCode} </td>
                    <td> {item.taskType.taskType} </td>
                    <td onClick={() => this.handleModalClickDetail(item)} style={{ cursor: 'pointer', maxWidth: '230px' }}> <Scrollbars autoHeight> <p style={{ whiteSpace: 'pre-line', textAlign: 'left' }}> {item.dtsTaskDesc} </p> </Scrollbars> </td>
                    <td onClick={() => this.handleModalClickTime(item)} style={{ cursor: 'pointer' }}> {dailyHrs} </td>
                    <td> {approveEditable} </td>
                    <td style={{ maxWidth: '230px' }}> <Scrollbars autoHeight> <p style={{ whiteSpace: 'pre-line', textAlign: 'left' }}> {item.dtsRemark} </p> </Scrollbars> </td>
                </tr>
            )

        }) : dtsdataArray.push(<tr key={1}><td colSpan='10' style={{ textAlign: 'center', color: 'white' }}>ไม่พบข้อมูล</td></tr>)


        let totalHrs = this.props.totaltime

        if (totalHrs.toString().charAt(0) === '0') {
            totalHrs = totalHrs.toString().slice(1)
        }

        return (
            <React.Fragment>
                <Row style={{ marginTop: '10px' }}>
                    <Col lg={{ size: '12' }}>
                        <div className='faltutable'>
                            <Table bordered className='tableresult'>
                                <thead>
                                    <tr style={{ color: 'white', textAlign: 'center', backgroundColor: '#1F3358', whiteSpace: 'nowrap' }}>
                                        <th>แก้ไข</th>
                                        <th>วันที่</th>
                                        <th>ชื่อ-นามสกุล</th>
                                        <th>รหัสโครงการ</th>
                                        <th>ประเภทงาน</th>
                                        <th>รายละเอียด</th>
                                        <th>เวลาที่ใช้(ชม.)</th>
                                        <th>Lead All                        {/*<FontAwesomeIcon icon={['fas', 'user-times']} size='1x' /> */}
                                            {this.props.leadAll ?
                                                <FontAwesomeIcon icon={['far', 'dot-circle']} size='1x' style={{ color: "red", cursor: 'pointer' }} onClick={this.props.handleLeadAll} /> :
                                                <FontAwesomeIcon icon={['far', 'circle']} size='1x' style={{ color: "red", cursor: 'pointer' }} onClick={this.props.handleLeadAll} />
                                            }
                                        </th>
                                        <th> หมายเหตุ </th>
                                    </tr>
                                </thead>
                                <tbody style={{ textAlign: 'center' }}>
                                    {dtsdataArray}
                                </tbody>
                            </Table>
                        </div>

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

                {this.state.editClick ? <EditFormAA stateinfo={this.state}
                    handleTextChange={this.handleTextChange}
                    editTimesheetConfirm={this.editTimesheetConfirm}
                    handleDropdownChange={this.handleDropdownChange}
                    closeModal={this.closeModal}
                    fetchData={this.props.fetchData}
                    modalname='editapprove'
                    handleTimeChange={this.handleTimeChange}
                    handleFocusedChange={this.handleFocusedChange}
                    handleLunchBreak={this.handleLunchBreak}
                    startClockFocus={this.state.startClockFocus}
                    endClockFocus={this.state.endClockFocus}
                    onFocusChange={this.onFocusChange}
            /> : ''}
            </React.Fragment>
        )

    }

}