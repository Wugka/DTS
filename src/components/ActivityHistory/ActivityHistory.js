import React, { Component } from 'react';
import SearchBarAH from './SearchBarAH'
import TableResultAH from './TableResultAH'
import AuthService from '../AuthService';
import axios from 'axios'
import moment from 'moment'
import { Container } from 'reactstrap'
import swal from 'sweetalert'


var auth = new AuthService()

export default class ActivityHistory extends Component {
    constructor() {
        super()
        const sdate = new Date()
        const now = new Date()
        sdate.setDate(sdate.getDate() - 3)

        this.state = {
            jsondata: [], projectlist: [], startDate: sdate, stopDate: now, showTaskClick: false, deleteStatus: false, editStatus: false, leadStatus: false,
            projCode: '', taskType: '', detail: '', sumHrs: 0, remark: '',
            projectId: 0, projectName: 'ทั้งหมด', currentPage: 1, paging: {}, totaltime: 0
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.fetchData = this.fetchData.bind(this)
        this.updateData = this.updateData.bind(this)
        this.handleDropdownChange = this.handleDropdownChange.bind(this)
        this.handlePagination = this.handlePagination.bind(this)

    }

    //************************************************************************************************************************************

    async componentDidMount() {
        const empId = auth.getProfile()
        const webapiurl = await axios.get('api/ConfigFromAppSetting')
        const now = moment().format('YYYY-MM-DD 23:59:59')
        const startdt = (moment().subtract(3, 'days')).format('YYYY-MM-DD 00:00:00')

        Promise.all([
            auth.fetchWithToken(webapiurl.data + '/api/v1/TransDtsDescs/page?datestart=' + startdt + '&datestop=' + now + '&PageNumber=1&PageSize=10', "method:'GET'"),
            auth.fetchWithToken(webapiurl.data + '/api/v1/ProjectEmployees/' + empId.nameid, "method:'GET'")
        ])
            .then(([response1, response2]) => this.setState({
                jsondata: response1.data.items,
                paging: response1.data.paging,
                projectlist: response2.data,
                totaltime: response1.data.totalTime.totaltimeValue
              
            }))

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
        })
    }

      //************************************************************************************************************************************

    handleDropdownChange(e) {
        let value = e.value
        let label = e.label

            this.setState({
                projectName: label,
                projectId: value
            })
        

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

    handleChange(name, val) {
        this.setState({ [name]: val })
    }

    handleClick() {
        this.setState({ currentPage: 1 }, function () {
            this.fetchData()
        })
    }

    updateData() {
        this.fetchData()
    }

    async fetchData() {
        if (moment(this.state.stopDate) <  moment(this.state.startDate)) {
            swal({ text: 'วันเริ่มต้นต้องน้อยกว่าวันสิ้นสุด', icon: 'warning' })
                return
        }
        
        const webapiurl = await axios.get('api/ConfigFromAppSetting')
        const startdt = moment(this.state.startDate).format('YYYY-MM-DD 00:00:00')
        const stopdt = moment(this.state.stopDate).format('YYYY-MM-DD 23:59:59')
        let url = '/api/v1/TransDtsDescs'
        if (this.state.projectId != 0) {
            url = '/api/v1/TransDtsDescs/History/' + this.state.projectId
        }

        auth.fetchWithToken(webapiurl.data + url + '/page?datestart=' + startdt + '&datestop=' + stopdt + '&PageNumber=' + this.state.currentPage + '&PageSize=10'  , "method:'GET'")
            .then(response => this.setState({
                jsondata: response.data.items,
                paging: response.data.paging,
                totaltime: response.data.totalTime.totaltimeValue
            }))
    }

    //************************************************************************************************************************************

    render() {

        return (
            <Container>
                <SearchBarAH
                    handleChange={this.handleChange}
                    startDate={this.state.startDate}
                    stopDate={this.state.stopDate}
                    handleClick={this.handleClick}
                    projectlist={this.state.projectlist}
                    handleDropdownChange={this.handleDropdownChange}
                    projectname={this.state.projectName}
                    projectid={this.state.projectId}
                />
                    
                <TableResultAH
                    jsondata={this.state.jsondata}
                    fetchData={this.fetchData}
                    updateData={this.updateData}
                    handlePagination={this.handlePagination}
                    paging={this.state.paging}
                    currentPage={this.state.currentPage}
                    totaltime={this.state.totaltime}
                />
            </Container>
        );

    }
}