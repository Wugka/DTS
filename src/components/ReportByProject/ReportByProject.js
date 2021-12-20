import React, { Component } from 'react'
import SearchBarRPT from './SearchBarRPT'
import AuthService from '../AuthService';
import axios from 'axios'
import moment, { months, now } from 'moment'
import swal from 'sweetalert'
import { Container } from 'reactstrap'
import { text } from '@fortawesome/fontawesome-svg-core';

var auth = new AuthService()

export default class ReportByProject extends Component {
    constructor() {
        super()
        const now = new Date()
        const profile = auth.getProfile()
        const empid = profile.nameid

        const monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
            "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
        ];

        this.state = {
            empid: empid, jsondata: [], projectlist: [], underlinglist: [], startDate: now, stopDate: now, underlingDropdownName: 'ทั้งหมด', underlingDropdownyear: now.getFullYear(),
            underlingDropdownId: 0, currentstatus: '0', monthlist: [], yearlist: [], underlingDropdownIdyear: now.getFullYear(), underlingDropdownmonth: monthNames[now.getMonth()], underlingDropdownIdmonth: now.getMonth() + 1
            , urltest: '', projectId: '', projectName: 'กรุณาเลือก', projectCode: '',
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.handleDropdownChange = this.handleDropdownChange.bind(this)
        this.handleDropdownChangeyear = this.handleDropdownChangeyear.bind(this)
        this.handleDropdownChangemonth = this.handleDropdownChangemonth.bind(this)
        this.handleDropdownChangeProject = this.handleDropdownChangeProject.bind(this)
        this.fetchDataPro = this.fetchDataPro.bind(this)
    }

    handleDropdownChange(e) {
        let value = e.value
        let label = e.label

        this.setState({
            underlingDropdownName: label,
            underlingDropdownId: value
        })
        
    }

    handleDropdownChangeProject(e) {
        let value = e.value
        let label = e.label
      
        this.setState({
            projectName: label,
            projectId: value,
           
        })
    }

    handleClick(e) {
        this.fetchData(e)
    }

    handleDropdownChangeyear(e) {
        const event = e.currentTarget
        const value = event.getAttribute('valuey')
        const name = event.getAttribute('namey')
        const idname = event.getAttribute('idnamey')
        const idval = event.getAttribute('idy')
        this.setState({
            [name]: value,
            [idname]: idval
        }, () => this.fetchDataPro())
    }

    handleDropdownChangemonth(e) {
        const event = e.currentTarget
        const value = event.getAttribute('valuem')
        const name = event.getAttribute('namem')
        const idname = event.getAttribute('idnamem')
        const idval = event.getAttribute('idm')
        this.setState({
            [name]: value,
            [idname]: idval
        }, () => this.fetchDataPro())
    }

    handleChange(name, val) {
        this.setState({ [name]: val })
    }

    //************************************************************************************************************************************

    async componentDidMount() {
        const empId = auth.getProfile()
        const webapiurl = await axios.get('api/ConfigFromAppSetting')
        const dtstart = moment().format('YYYY-MM-DD 00:00:00')
        const dtstop = moment().format('YYYY-MM-DD 23:59:59')

        Promise.all([
            auth.fetchWithToken(webapiurl.data + '/api/v1/Employees/Underling/Report', "method:'GET'"),
            auth.fetchWithToken(webapiurl.data + '/api/v1/TransDtsDescs/Underling/?datestart=' + dtstart + '&datestop=' + dtstop + '&status=' + this.state.currentstatus, "method:'GET'"),
            auth.fetchWithToken(webapiurl.data + '/api/v1/TransDtsDescs/Year', "method:'GET'"),
            auth.fetchWithToken(webapiurl.data + '/api/v1/TransDtsDescs/Month', "method:'GET'"),
            auth.fetchWithToken(webapiurl.data + '/api/v1/Projects/Report/' + empId.nameid + '?month=' + this.state.underlingDropdownIdmonth + '&year=' + this.state.underlingDropdownIdyear, "method:'GET'")

        ])
            .then(([underlinglist, empdtsinfo, yearlist, monthlist,projectlist]) => this.setState({
                underlinglist: underlinglist.data,
                jsondata: empdtsinfo.data,
                yearlist: yearlist.data,
                monthlist: monthlist.data,
                projectlist: projectlist.data
            }))
            .catch(error => console.log(error));
    }
    async fetchDataPro() {
        const webapiurl = await axios.get('api/ConfigFromAppSetting')
        const empId = auth.getProfile()
        Promise.all([
            auth.fetchWithToken(webapiurl.data + '/api/v1/Projects/Report/' + empId.nameid + '?month=' + this.state.underlingDropdownIdmonth + '&year=' + this.state.underlingDropdownIdyear, "method:'GET'")
        ]).then(([ projectlist]) => this.setState({          
            projectlist: projectlist.data
        }))
            .catch(error => console.log(error));
    }


    //************************************************************************************************************************************

    async fetchData(e) {

        const webapiurl = await axios.get('api/ConfigFromAppSetting')
        let url = ''
        const dtstart = moment(this.state.startDate).format('YYYY-MM-DD 00:00:00')
        const dtstop = moment(this.state.stopDate).format('YYYY-MM-DD 23:59:59')

       // console.log('projectCode ' + this.state.projectCode)
        if (this.state.projectId == "0" || this.state.projectId == "" ) {
            swal({ text: 'กรุณาเลือกรหัสโครงการ', icon: 'warning' })
            return
        };

        const procodename = this.state.projectlist.filter(item => item.projId == this.state.projectId)  

        if (this.state.underlingDropdownId == 0) {
            // ดาวน์โหลดรายงานทั้งหมด  

            url = '/api/v1/TransDtsDescs/Report/Project?dtStart=' + dtstart + '&dtStop=' + dtstop + "&projid=" + this.state.projectId
        } else {
            // ดาวน์โหลดรายงาน byid
           
            url = '/api/v1/TransDtsDescs/Report/Project/' + this.state.underlingDropdownId + '?dtStart=' + dtstart + '&dtStop=' + dtstop + "&projid=" + this.state.projectId
        }
        
        const monthNamess = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
            "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
        ];

        const startSplit = dtstart.split(' ')
        const startDateSplit = startSplit[0].split('-')
        if (startDateSplit[1].charAt(0) == '0') {
            startDateSplit[1] = startDateSplit[1].slice(1)
        }
        const startName = startDateSplit[2] + monthNamess[startDateSplit[1] - 1] + startDateSplit[0]

        const stopSplit = dtstop.split(' ')
        const stopDateSplit = stopSplit[0].split('-')
        if (stopDateSplit[1].charAt(0) == '0') {
            stopDateSplit[1] = stopDateSplit[1].slice(1)
        }
        const stopName = stopDateSplit[2] + monthNamess[stopDateSplit[1] - 1] + stopDateSplit[0]
        const filename = procodename[0].projCode + '_' + startName + ' ถึง ' + stopName + '.xlsx'
        
        //const filename = procodename[0].projCode + '_' + monthth + this.state.underlingDropdownIdyear + '.xlsx'
        axios({
            url: webapiurl.data + url,
            method: 'GET',
            headers: { "Authorization": `Bearer ${auth.getToken()}` },
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
        }).catch(error => {
            swal({ text: 'ไม่พบข้อมูล', icon: 'warning' })
        });
    }


    //************************************************************************************************************************************
    render() {
        return (
            //<div></div>
            <div style={{ margin: '15px' }}>
                <Container>
                    {/*<a href={this.state.urltest}>urltest</a>*/}
                    <SearchBarRPT
                        underlinglist={this.state.underlinglist}
                        yearlist={this.state.yearlist}
                        monthlist={this.state.monthlist}
                        handleChange={this.handleChange}
                        startDate={this.state.startDate}
                        stopDate={this.state.stopDate}
                        projectname={this.state.projectName}
                        projectCode={this.state.projectCode}
                        projectid={this.state.projectId}
                        handleClick={this.handleClick}
                        fetchDataPro={this.fetchDataPro}
                        projectlist={this.state.projectlist}
                        underlingDropdownName={this.state.underlingDropdownName}
                        handleDropdownChange={this.handleDropdownChange}
                        handleDropdownChangeProject={this.handleDropdownChangeProject}
                        handleDropdownChangeyear={this.handleDropdownChangeyear}
                        underlingDropdownyear={this.state.underlingDropdownyear}
                        handleDropdownChangemonth={this.handleDropdownChangemonth}
                        underlingDropdownmonth={this.state.underlingDropdownmonth}
                    />
                </Container>
            </div>

        )
    }
}



