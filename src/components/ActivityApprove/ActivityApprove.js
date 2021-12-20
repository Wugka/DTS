import React, { Component } from 'react'
import SearchBarAA from './SearchBarAA'
import TableResultAA from './TableResultAA'
import AuthService from '../AuthService';
import axios from 'axios'
import moment from 'moment'
import swal from 'sweetalert'
import { Container } from 'reactstrap'

var auth = new AuthService()

export default class ActivityApprove extends Component {
    constructor() {
        super()
        const now = new Date()
        const profile = auth.getProfile()
        const empid = profile.nameid

        this.state = {                                                                                                                                      // 0 false . 1 true . 2 both
            empid: empid, jsondata: [], underlinglist: [], startDate: now, stopDate: now, underlingDropdownName: 'ทั้งหมด',
            underlingDropdownId: 0, underlingidrow: -1, passstatus: false, failstatus: false, bothstatus: true, currentstatus: '2',
            leadAll: false, currentPage: 1, paging: {}, originalArray: [], totaltime: 0
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleRadioClick = this.handleRadioClick.bind(this)
        this.handleDropdownChange = this.handleDropdownChange.bind(this)
        this.handleLead = this.handleLead.bind(this)
        this.handleLeadAll = this.handleLeadAll.bind(this)
        this.fetchData = this.fetchData.bind(this)
        this.updateStatusApprove = this.updateStatusApprove.bind(this)
        this.showtaskresetpage = this.showtaskresetpage.bind(this)

        this.handlePagination = this.handlePagination.bind(this)
    }

    //************************************************************************************************************************************

    handlePagination(pagenum) {
        const totalpage = this.state.totalPage
        if (pagenum < 1) {
            pagenum = 1
        }
        else if (pagenum > totalpage) {
            pagenum = totalpage
        }

        this.setState({ currentPage: pagenum }, function () {
            this.fetchData() 
            }
        )
    }

    handleRadioClick(e, name) {
        if (name == 'passstatus') {
            this.setState({ passstatus: true, failstatus: false, bothstatus: false, currentstatus: '1' })
        }
        else if (name == 'failstatus') {
            this.setState({ passstatus: false, failstatus: true, bothstatus: false, currentstatus: '0' })
        }
        else if (name == 'bothstatus') {
            this.setState({ passstatus: false, failstatus: false, bothstatus: true, currentstatus: '2' })
        }
    }


    showtaskresetpage() {
        this.setState({ currentPage: 1 }, function () {
            this.fetchData()
        })
    }

    //************************************************************************************************************************************

    handleDropdownChange(e) {
        let value = e.value
        let label = e.label

        this.setState({
            underlingDropdownName: label,
            underlingDropdownId: value
        })

    }

    //************************************************************************************************************************************

    handleChange(name, val) {
        this.setState({ [name]: val })
    }

    //************************************************************************************************************************************

    handleLead(item) {
        let AllApprove = true

        if (this.state.leadAll === true) {
            this.setState({ leadAll: false })
        }

        this.setState(prevState => ({
            jsondata: prevState.jsondata.map(el => el.dtsNo === item.dtsNo ? { ...el, dtsLeadApprove: item.dtsLeadApprove === 1 ? 0 : 1 } : el)
        }), function () {

            const dtsdata = this.state.jsondata
            for (var item in dtsdata) {

                if (dtsdata[item].dtsLeadApprove === 0) {
                    AllApprove = false
                    break
                }
            }

            if (AllApprove === true) {
                this.setState({ leadAll: true })
            }

        })
    }

    //************************************************************************************************************************************

    handleLeadAll() {
        this.setState({ leadAll: !this.state.leadAll }, function () {

            if (this.state.leadAll) {
                this.setState(prevState => ({
                    jsondata: prevState.jsondata.map(el => el.employees.missionEmployees.employeesHead.empId != this.state.empid ? el : { ...el, dtsLeadApprove: 1 })                        
                })
                ) 
            }
            else {
                this.fetchData()
            }

        })
    }

    //************************************************************************************************************************************

    async updateStatusApprove() {
        const webapiurl = await axios.get('api/ConfigFromAppSetting')
        const jsondata = this.state.jsondata
        const originaljsondata = this.state.originalArray
        let approves = []
        var isSame = true

        for (var item in jsondata) {
            if (jsondata[item].dtsLeadApprove != originaljsondata[item].dtsLeadApprove) {
                isSame = false
                break
            }
        }

        if (isSame === false || (isSame === false && this.state.leadAll === true)) {
            for (var item in jsondata) {
                var jobj = {}
                jobj['DtsID'] = jsondata[item].dtsNo
                jobj['Dts_Lead_Approve'] = jsondata[item].dtsLeadApprove
                approves.push(jobj)
            }

            auth.fetchWithToken(webapiurl.data + '/api/v1/TransDtsDescs/Approve', { method: 'PUT', data: approves })
                .then(response => {
                    if (auth._IsSuccessResponse(response)) {
                        swal({ text: 'อัพเดทข้อมูลสำเร็จ', icon: 'success' })
                        this.fetchData()
                    }
                    else {
                        swal({ text: 'ไม่่สามารถอัพเดทข้อมูลได้', icon: 'warning' })
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
        else {
            swal({text: 'กรุณาเลือกอนุมัติกิจกรรม อย่างน้อย1คน', icon:'warning'})
        }
 
    }

    //************************************************************************************************************************************

    async componentDidMount() {

        const webapiurl = await axios.get('api/ConfigFromAppSetting')
        const dtstart = moment().format('YYYY-MM-DD 00:00:00')
        const dtstop = moment().format('YYYY-MM-DD 23:59:59')

        Promise.all([
            auth.fetchWithToken(webapiurl.data + '/api/v1/Employees/Underling', "method:'GET'"),
            auth.fetchWithToken(webapiurl.data + '/api/v1/TransDtsDescs/Underling/page?datestart=' + dtstart + '&datestop=' + dtstop + '&status=' + this.state.currentstatus + '&PageNumber=1&PageSize=10', "method:'GET'")

        ])
            .then(([underlinglist, empdtsinfo]) => this.setState({
                underlinglist: underlinglist.data,
                jsondata: empdtsinfo.data.items,
                paging: empdtsinfo.data.paging,
                originalArray: empdtsinfo.data.items,
                totaltime: empdtsinfo.data.totalTime.totaltimeValue
            }))
            .catch(error => console.log(error));
    }

    //************************************************************************************************************************************

    async fetchData() {
        if (moment(this.state.stopDate) < moment(this.state.startDate)) {
            swal({ text: 'วันเริ่มต้นต้องน้อยกว่าวันสิ้นสุด', icon: 'warning' })
            return
        }

        const webapiurl = await axios.get('api/ConfigFromAppSetting')
        const dtstart = moment(this.state.startDate).format('YYYY-MM-DD 00:00:00')
        const dtstop = moment(this.state.stopDate).format('YYYY-MM-DD 23:59:59')
        let url = ''

        if (this.state.underlingDropdownId == 0) {
            url = '/api/v1/TransDtsDescs/Underling/page?datestart=' + dtstart + '&datestop=' + dtstop + '&status=' + this.state.currentstatus + '&PageNumber=' + this.state.currentPage + '&PageSize=10'    // 0 ทั้งหมด get All underling
        } else {
            url = '/api/v1/TransDtsDescs/Underling/' + this.state.underlingDropdownId + '/page?datestart=' + dtstart + '&datestop=' + dtstop + '&status=' + this.state.currentstatus + '&PageNumber=' + this.state.currentPage + '&PageSize=10' // != 0 get เฉพาะUnderling ที่ส่งไป
        }

        auth.fetchWithToken(webapiurl.data + url , "method:'GET'")
            .then(response => this.setState({
                jsondata: response.data.items,
                paging: response.data.paging,
                originalArray: response.data.items,
                leadAll: false,
                totaltime: response.data.totalTime.totaltimeValue
            }))
            .catch(err => console.log(err))
    }

    //************************************************************************************************************************************

    render() {
        return (
            <Container>
                <SearchBarAA
                    underlinglist={this.state.underlinglist}
                    handleChange={this.handleChange}
                    startDate={this.state.startDate}
                    stopDate={this.state.stopDate}
                    passstatus={this.state.passstatus}
                    failstatus={this.state.failstatus}
                    bothstatus={this.state.bothstatus}
                    handleRadioClick={this.handleRadioClick}
                    fetchData={this.fetchData}
                    underlingDropdownName={this.state.underlingDropdownName}
                    underlingDropdownId={this.state.underlingDropdownId}
                    handleDropdownChange={this.handleDropdownChange}
                    updateStatusApprove={this.updateStatusApprove}
                    jsondata={this.state.jsondata}
                    showtaskresetpage={this.showtaskresetpage}
                />
                <TableResultAA
                    jsondata={this.state.jsondata}
                    loginid={this.state.empid}
                    fetchData={this.fetchData}
                    handleLead={this.handleLead}
                    leadAll={this.state.leadAll}
                    handleLeadAll={this.handleLeadAll}
                    handlePagination={this.handlePagination}
                    paging={this.state.paging}
                    currentPage={this.state.currentPage}
                    totaltime={this.state.totaltime}
                />
            </Container>
        )
    }

}