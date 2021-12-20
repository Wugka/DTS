import React, { Component } from 'react'
import { Row, Col, FormGroup, Input, Modal, ModalHeader, ModalBody, ModalFooter, Button, Label } from 'reactstrap';
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CalcEtc from '../CalcEtc'
import '../../css/slimscroll.css'
import TimePicker from 'react-times'
import axios from 'axios'
import AuthService from '../AuthService'
import Select from 'react-select'

var calc = new CalcEtc()

export default class EditFormAA extends Component {
    constructor(props) {
        super(props)
        this.state = { projectlist: [], tasklist: [], underlingid: props.stateinfo.rowempid}
    }

    //*****************************************************************************************************************************************************************************

    componentWillReceiveProps(nextprops) {
        if (this.props.stateinfo.rowempid != nextprops.stateinfo.rowempid) {
            this.setState({ underlingid: nextprops.stateinfo.rowempid })
            this.fetchUnderlingProject()
        }
    }

    //*****************************************************************************************************************************************************************************

    async fetchUnderlingProject() {
        const auth = new AuthService()
        const webapiurl = await axios.get('api/ConfigFromAppSetting')

            auth.fetchWithToken(webapiurl.data + '/api/v1/ProjectEmployees/' + this.state.underlingid, "method:'GET'")
            .then((projlist) => this.setState({
                projectlist: projlist.data
            }))
            .catch(error => console.log(error));
    }

    //*****************************************************************************************************************************************************************************


    async componentDidMount() {
        const auth = new AuthService()
        const profile = auth.getProfile()
        const webapiurl = await axios.get('api/ConfigFromAppSetting')
        //const test = await auth.fetchWithToken(webapiurl.data + '/api/v1/Projects', "method:'GET'")

        Promise.all([
            auth.fetchWithToken(webapiurl.data + '/api/v1/ProjectEmployees/' + this.state.underlingid, "method:'GET'"),
            auth.fetchWithToken(webapiurl.data + '/api/v1/TaskTypes', "method:'GET'")
            //axios.get(webapiurl.data + '/api/v1/Projects'),
            //axios.get(webapiurl.data + '/api/v1/TaskTypes')
        ])
            .then(([projlist, tsklist]) => this.setState({
                projectlist: projlist.data,
                tasklist: tsklist.data
            }))
            .catch(error => console.log(error));
    }

    //*****************************************************************************************************************************************************************************

    togglemodal(modalprops) {

        const stateinfo = modalprops.stateinfo
        const toggle = () => {
            modalprops.closeModal()
        }

        let startDate = new Date(stateinfo.startDate)
        let endDate = new Date(stateinfo.endDate)
        const startTimeArray = stateinfo.startTime.split(':')
        const endTimeArray = stateinfo.endTime.split(':')
        startDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), startTimeArray[0], startTimeArray[1])
        endDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), endTimeArray[0], endTimeArray[1])

        const startdateformat = moment(startDate).format('DD/MM/YYYY')
        const enddateformat = moment(endDate).format('DD/MM/YYYY')

        let totalMs = calc.calcTotalHour(startDate, endDate, stateinfo.lunchBreak)
        const hour = Math.floor((totalMs / (1000 * 60 * 60)))
        const minute = Math.floor((totalMs / (1000 * 60)) % 60)
        const totalHrs = hour + ':' + ('0' + minute).slice(-2)

        let addOrEdit = ''
        let headerModal = ''

        addOrEdit = <Button onClick={() => modalprops.editTimesheetConfirm(modalprops.fetchData)} outline color="danger" style={{ color: 'white', margin: '5px' }}>บันทึก</Button>
        headerModal = <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
            <FontAwesomeIcon icon={['fas', 'edit']} style={{ color: '#39B54A', margin: '5px', }} size='1x' /> <span style={{ fontSize: '16px' }}> EDIT DAILY TIME SHEET</span>
        </div>

        let lunchBreakIcon
        if (stateinfo.lunchLock === true) {
            lunchBreakIcon = <FontAwesomeIcon icon={['fas', 'lock']} size='lg' style={{ color: "red", cursor: 'no-drop', paddingRight: '3px' }} />

        } else {
            lunchBreakIcon =
                stateinfo.lunchBreak ? <FontAwesomeIcon icon={['far', 'dot-circle']} size='lg' style={{ color: "red", cursor: 'pointer', paddingRight: '3px' }} onClick={modalprops.handleLunchBreak} />
                    : <FontAwesomeIcon icon={['far', 'circle']} size='lg' style={{ color: "red", cursor: 'pointer', paddingRight: '3px' }} onClick={modalprops.handleLunchBreak} />
        }

        const projectOptions = []
        const taskOptions = []

        modalprops.projectlist ? modalprops.projectlist.map((item, key) => {
            projectOptions.push({ key: key, value: item.project.projId, label: item.project.projCode + ' ' + item.project.projName })
        }) : projectOptions.push({ key: 0, value: 0, label: 'ไม่พบข้อมูล' })

        modalprops.tasklist ? modalprops.tasklist.map((item, key) => {
            taskOptions.push({ key: key, value: item.taskId, label: item.taskType })
        }) : taskOptions.push({ key: 0, value: 0, label: 'ไม่พบข้อมูล' })


        return (
            <span>
                <Modal contentClassName='reviewdocmodal' isOpen={stateinfo.showModal} toggle={toggle} size='lg' >
                    <ModalHeader toggle={toggle}>
                        {headerModal}
                    </ModalHeader>
                    <ModalBody>

                        <Row>
                            <Col lg="3" md='6' sm='6' xs='12' style={{ marginBottom: '10px' }}>
                                <FormGroup>
                                    <div style={{ float: "left", marginRight: '27px' }}>
                                        <Label for="date">วันที่</Label>
                                    </div>
                                    <div style={{ float: "left" }}>
                                        <input readOnly style={{ border: '1px solid red', backgroundColor: '#21375F', color: 'white', textAlign: 'center' }} placeholder={startdateformat} />
                                    </div>
                                </FormGroup>
                            </Col>
                            <Col style={{ clear: 'both', marginBottom: '10px' }} lg="3" md='6' sm='6' xs='12'>
                                <FormGroup>
                                    <div style={{ float: "left", marginRight: '25px' }}>
                                        <Label for="datestart">เวลา</Label>
                                    </div>
                                        <div style={{ float: "left" }}>
                                        <TimePicker withoutIcon timeMode="24" minuteStep={1} time={stateinfo.startTime} focused={modalprops.startClockFocus} onFocusChange={(f) => modalprops.onFocusChange(f, 'startClockFocus')} onTimeChange={(option) => modalprops.handleTimeChange(option, 'startTime')}
                                            trigger={(<input readOnly style={{ border: '1px solid red', backgroundColor: '#21375F', color: 'white', textAlign: 'center' }}
                                                onClick={() => modalprops.handleFocusedChange('startClockFocus', modalprops.startClockFocus)} placeholder={stateinfo.startTime} />)} />
                                    </div>
                                </FormGroup>

                            </Col>
                            <Col style={{ clear: 'both', marginBottom: '10px' }} lg="3" md='6' sm='6' xs='12'>
                                <FormGroup>
                                    <div style={{ float: "left", marginRight: '10px' }}>
                                        <Label for="date">ถึงวันที่</Label>
                                    </div>
                                    <div style={{ float: "left" }}>
                                        <input readOnly style={{ border: '1px solid red', backgroundColor: '#21375F', color: 'white', textAlign: 'center' }} placeholder={enddateformat} />
                                    </div>
                                </FormGroup>
                            </Col>

                            <Col style={{ clear: 'both', marginBottom: '10px' }} lg="3" md='6' sm='6' xs='12'>
                                <FormGroup>
                                    <div style={{ float: "left", marginRight: '25px' }}>
                                        <Label for="datestop">เวลา</Label>
                                    </div>
                                    <div style={{ float: "left" }}>
                                        <TimePicker withoutIcon timeMode="24" minuteStep={1} time={stateinfo.endTime} focused={modalprops.endClockFocus} onFocusChange={(f) => modalprops.onFocusChange(f, 'endClockFocus')} onTimeChange={(option) => modalprops.handleTimeChange(option, 'endTime')}
                                            trigger={(<input readOnly style={{ border: '1px solid red', backgroundColor: '#21375F', color: 'white', textAlign: 'center' }}
                                                onClick={() => modalprops.handleFocusedChange('endClockFocus', modalprops.endClockFocus)} placeholder={stateinfo.endTime} />)} />
                                    </div>
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row style={{ marginBottom: '10px' }}>
                            <Col lg='9' md='8' sm='8' xs='5'>
                                <div>
                                    {lunchBreakIcon}
                                    พักเที่ยง
                                </div>

                            </Col>
                            <Col lg='3' md='4' sm='4' xs='7'>
                                <label> เวลาที่ใช้ {totalHrs} ชม. </label>
                            </Col>
                        </Row>
                        <Row style={{ marginBottom: '10px' }}>
                            <Col lg='2'>
                                รหัสโครงการ
                            </Col>
                            <Col lg='6'>
                                <Input type="text" name="projectTxt" id="projectTxt" value={stateinfo.projectName} style={{ color: 'grey', backgroundColor: '#21375F', border: '1px solid black', overflow: 'hidden' }} readOnly />
                            </Col>
                            <Col lg='4'>
                                <Select
                                    defaultValue={{ label: stateinfo.projectName, value: stateinfo.projectId }}
                                    classNamePrefix='selectsearchdts'
                                    name='project'
                                    placeholder={stateinfo.projectName}
                                    options={projectOptions}
                                    isSearchable={true}
                                    onChange={(event) => modalprops.handleDropdownChange(event, 'project')}
                                    noOptionsMessage={() => 'ไม่พบข้อมูล'}
                                />
                            </Col>
                        </Row>
                        <Row style={{ marginBottom: '20px' }}>
                            <Col lg='2'>
                                ประเภทงาน
                            </Col>
                            <Col lg='6'>
                                <Input type="text" name="taskTxt" id="taskTxt" value={stateinfo.taskType} style={{ color: 'grey', backgroundColor: '#21375F', border: '1px solid black', overflow: 'hidden' }} readOnly />
                            </Col>
                            <Col lg='4'>
                                <Select
                                    defaultValue={{ label: stateinfo.taskType, value: stateinfo.taskId }}
                                    classNamePrefix='selectsearchdts'
                                    name='task'
                                    placeholder={stateinfo.taskType}
                                    options={taskOptions}
                                    isSearchable={true}
                                    onChange={(event) => modalprops.handleDropdownChange(event, 'task')}
                                    noOptionsMessage={() => 'ไม่พบข้อมูล'}
                                />
                            </Col>
                        </Row>
                        <Row style={{ marginBottom: '10px' }}>
                            <Col lg='2'>
                                ข้อมูลรายละเอียด
                            </Col>
                            <Col lg='6'>
                                <FormGroup>
                                    <Input className='slimscrolltext' maxLength='200' type="textarea" value={stateinfo.detail} onChange={(text) => modalprops.handleTextChange(text, 'detail')} name="detail" style={{ backgroundColor: '#21375F', border: '1px solid black', color: 'white' }} />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row style={{ marginBottom: '10px' }}>
                            <Col lg='2'>
                                หมายเหตุ
                            </Col>
                            <Col lg='6'>
                                <FormGroup>
                                    <Input className='slimscrolltext' maxLength='200' type="textarea" value={stateinfo.remark} onChange={(text) => modalprops.handleTextChange(text, 'remark')} name="remark" style={{ backgroundColor: '#21375F', border: '1px solid black', color: 'white' }} />
                                </FormGroup>
                            </Col>
                        </Row>
                        <p style={{ textAlign: "center" }}>
                            {addOrEdit}
                            <Button onClick={modalprops.closeModal} outline color="danger" style={{ color: 'white', margin: '5px' }}>ยกเลิก</Button>
                        </p>

                    </ModalBody>
                    <ModalFooter>
                    </ModalFooter>
                </Modal>
            </span>
        )
    }

    //************************************************************************************************************************************

    render() {

        return (
            <React.Fragment>
                <this.togglemodal stateinfo={this.props.stateinfo}
                    projectlist={this.state.projectlist}
                    tasklist={this.state.tasklist}
                    handleDropdownChange={this.props.handleDropdownChange}
                    handleTextChange={this.props.handleTextChange}
                    editTimesheetConfirm={this.props.editTimesheetConfirm}
                    closeModal={this.props.closeModal}
                    openModal={this.props.openModal}
                    fetchData={this.props.fetchData}
                    modalname={this.props.modalname}
                    handleTimeChange={this.props.handleTimeChange}
                    handleFocusedChange={this.props.handleFocusedChange}
                    startClockFocus={this.props.startClockFocus}
                    endClockFocus={this.props.endClockFocus}
                    handleLunchBreak={this.props.handleLunchBreak}
                    onFocusChange={this.props.onFocusChange}
                    clickuser={this.state.underlingid}
                />
            </React.Fragment>
        )
    }

}