import React, { Component } from 'react'
import { Button, Modal, ModalBody, ModalHeader, Col, Row, Table } from 'reactstrap';
import axios from 'axios'
import AuthService from '../AuthService';
import Select from 'react-select'
import moment from 'moment'
import swal from 'sweetalert'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DtsDatePicker from '../componentsReuse/DtsDatePicker';

const auth = new AuthService()
const now = new Date()

export default class WorkingDayCalendar extends Component {
    constructor() {
        super()
        this.state = {
            showModal: true,
            dropdownyear: now.getFullYear(),
            holidayArray: [],
            startDate: new Date(),
        }

        this.toggle = this.toggle.bind(this)
        this.fetchData = this.fetchData.bind(this)
        this.handleDropdownChange = this.handleDropdownChange.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.deleteHoliday = this.deleteHoliday.bind(this)
        this.addHoliday = this.addHoliday.bind(this)
    }

    //********************************************************************************************

    componentDidMount() {
        this.fetchData()
    }

    async fetchData() {
        const webapiurl = await axios.get('api/ConfigFromAppSetting')
        const year = this.state.dropdownyear
        let holidayArrayTemp = []

        auth.fetchWithToken(webapiurl.data + '/api/v1/Calendar/Year/' + year, { method: 'GET' })
            .then(response => {
                const data = response.data
                data ? data.map((item, key) => {
                    const newFormatDt = moment(item.month).format('DD/MM/YYYY')

                    holidayArrayTemp.push({
                        date: newFormatDt,
                        dateId: key
                    })
                }) : []

                this.setState({
                    holidayArray: holidayArrayTemp
                })
            })
            .catch(error => {
                console.log('error:' + error)
            })

    }

    //********************************************************************************************

    toggle() {
        this.setState({ showModal: false }, function () {
            this.props.history.goBack() // Moves the pointer in the history stack by -1 entries
        })
    }

    //********************************************************************************************

    handleChange(name, val) {
        this.setState({ [name]: val })
    }

    handleDropdownChange(e, name) {
        let value = e.value

        this.setState({
            [name]: value,
        }, () => this.fetchData())
    }

    //********************************************************************************************

    //handleInputChange(e, index) {
    //    const val = e.target.value
    //    const re = /^[0-9]*$/;

    //    if (!re.test(e.target.value)) {
    //        e.preventDefault()
    //    }
    //    else {
    //        let monthArray = this.state.monthArray

    //        monthArray[index].sum_Day = val
    //        const newMonthArray = monthArray
    //        this.setState({
    //            monthArray: newMonthArray
    //        })
    //    }
    //}

    //********************************************************************************************

    async addHoliday() {
        const webapiurl = await axios.get('api/ConfigFromAppSetting')
        const jsondata = { 'Month': this.state.startDate, 'Sum_Day': null}

        const dateToAdd = moment(this.state.startDate).format('DD/MM/YYYY')

        if (dateToAdd.split('/')[2] != this.state.dropdownyear){
            return swal({ text: 'ปีต้องตรงกับปีที่ระบุไว้ด้านบน', icon: 'warning' })
        }
        
        auth.fetchWithToken(webapiurl.data + '/api/v1/Calendar/Date' , { method: 'POST', data: jsondata})
            .then(response => {
                if (auth._IsSuccessResponse(response) === true) {
                    swal({ text: 'บันทึกข้อมูลเรียบร้อยแล้ว', icon: 'success' })
                    this.fetchData()
                }
            })
            .catch(error => {
                if (error.response && error.response.data && error.response.data.message) {
                    swal({ text: error.response.data.message, icon: 'warning' })
                }
                else {
                    swal({ text: 'ไม่สามารถเพิ่มข้อมูลได้', icon: 'warning' })
                }
            })
    }

    //********************************************************************************************

    async deleteHoliday(deleteItem) {
        console.log(JSON.stringify(deleteItem))
        const webapiurl = await axios.get('api/ConfigFromAppSetting')
        var dateSplit = deleteItem.date.split('/')
        var newFormatDateString = dateSplit[1] + '/' + dateSplit[0] + '/' + dateSplit[2]
        const jsondata = { 'Month': newFormatDateString, 'Sum_Day': null }
       
        auth.fetchWithToken(webapiurl.data + '/api/v1/Calendar', { method: 'DELETE', data: jsondata })
            .then(response => {
                if (auth._IsSuccessResponse(response) === true) {
                    swal({ text: 'ระบบทำการลบข้อมูลเรียบร้อยแล้ว', icon: 'success' })
                    this.fetchData()
                }
            })
            .catch(error => {
                if (error.response && error.response.data && error.response.data.message) {
                    swal({ text: error.response.data.message, icon: 'warning' })
                }
                else {
                    swal({ text: 'ไม่สามารถลบข้อมูลได้ โปรดลองใหม่ภายหลัง', icon: 'warning' })
                }
            })
    }

    render() {

        const dropdownyear = [
            { key: 0, value: now.getFullYear() - 1, label: now.getFullYear() - 1 },
            { key: 1, value: now.getFullYear(), label: now.getFullYear() },
            { key: 2, value: now.getFullYear() + 1, label: now.getFullYear() + 1 },
        ]
        const holidayElement = []

        this.state.holidayArray ? this.state.holidayArray.map((item, key) => {
            holidayElement.push(
                <tr key={key}>
                    <td>{item.date}</td>
                    <td>
                        <FontAwesomeIcon
                            onClick={() => this.deleteHoliday(item)}
                            icon={['far', 'minus-square']}
                            style={{ color: 'red', cursor: 'pointer' }}
                            size='2x' />
                    </td>
                </tr>
            )
        }) : []

        return (
            <Modal contentClassName='reviewdocmodal' isOpen={this.state.showModal} toggle={this.toggle} size='md' >
                <ModalHeader toggle={this.toggle} style={{ borderBottom: 'none', paddingBottom: '0px' }}>
                    <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <Row style={{ marginBottom: '10px',whiteSpace:'nowrap' }}>
                        <Col lg={4} md={3} sm={3} xs={5} style={{ display: 'flex', alignItems: 'center' }}>
                            กรุณาเลือกปี
                        </Col>
                        <Col lg={3} md={3} sm={3} xs={5} style={{ margin: '3px' }}>
                            <Select
                                classNamePrefix='selectsearchdtsblackstyle'
                                defaultValue={{ label: this.state.dropdownyear, value: this.state.dropdownyear }}
                                options={dropdownyear}
                                isSearchable={true}
                                onChange={(event) => this.handleDropdownChange(event, 'dropdownyear')}
                                noOptionsMessage={() => 'ไม่พบข้อมูล'}
                            />
                        </Col>
                    </Row>

                    <Row style={{ display: 'flex', alignItems: 'baseline' }}>
                        <Col lg={4} md={3} sm={3} xs={5} style={{ display: 'flex', alignItems: 'center',whiteSpace: 'nowrap' }}>
                            กรุณาระบุวันหยุด
                        </Col>
                        <Col lg={4} md={4} sm={8} xs={5} style={{whiteSpace:'nowrap'}}>
                            <DtsDatePicker startDate={this.state.startDate} name='startDate' handleChange={this.handleChange} allDateAvailable={true} />
                        </Col>

                        <Col lg={2} md={2} sm={2} xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                            <Button onClick={this.addHoliday} size='sm' outline color="danger" style={{ color: 'white', marginBottom: '5px' }}>บันทึก</Button>
                        </Col>
                    </Row>

                    <Row>
                        <Col lg={12}>
                            <Table borderless style={{ color: 'white' }} size='sm'>
                                <thead>
                                    <tr style={{ color: 'white', textAlign: 'center', backgroundColor: '#1F3358', whiteSpace: 'nowrap' }}>
                                        <th>วันหยุด</th>
                                        <th>ลบ</th>
                                    </tr>
                                </thead>
                                <tbody style={{ textAlign: 'center' }}>
                                    {holidayElement}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
        )
    }
}