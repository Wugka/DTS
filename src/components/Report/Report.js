import React, { Component } from 'react'
import SearchBarRPT from './SearchBarRPT'
import AuthService from '../AuthService';
import axios from 'axios'
import moment, { months, now } from 'moment'
import swal from 'sweetalert'
import { Container } from 'reactstrap'

var auth = new AuthService()

export default class Report extends Component {
    constructor() {
        super()
        const now = new Date()
        const profile = auth.getProfile()
        const empid = profile.nameid

        const monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
            "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
        ];

     
       // const items = []

        //for (const [index, value] of elements.entries()) {
        //    items.push(<li key={index}>{value}</li>)
        //}
        this.state = {                                                                                                                                      
            empid: empid,
            jsondata: [],
            underlinglist: [],
            startDate: now,
            stopDate: now,
            underlingDropdownName: 'ทั้งหมด',
            underlingDropdownyear: now.getFullYear(),
            underlingDropdownId: 0,
            currentstatus: '0',
            monthlist: [],
            yearlist: [],
            underlingDropdownIdyear: now.getFullYear(),
            underlingDropdownmonth: monthNames[now.getMonth()],
            underlingDropdownIdmonth: now.getMonth() + 1,
            urltest: '',
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.handleDropdownChange = this.handleDropdownChange.bind(this)
        this.handleDropdownChangeyear = this.handleDropdownChangeyear.bind(this)
    }
    
    handleDropdownChange(e) {
        let value = e.value
        let label = e.label

        this.setState({
            underlingDropdownName: label,
            underlingDropdownId: value
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
        })
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
        })
    }
    handleChange(name, val) {
        this.setState({ [name]: val })
    }

    //************************************************************************************************************************************

    async componentDidMount() {
      
        const webapiurl = await axios.get('api/ConfigFromAppSetting')
        const dtstart = moment().format('YYYY-MM-DD 00:00:00')
        const dtstop = moment().format('YYYY-MM-DD 23:59:59')

        Promise.all([
            auth.fetchWithToken(webapiurl.data + '/api/v1/Employees/Underling/Report', "method:'GET'"),
            auth.fetchWithToken(webapiurl.data + '/api/v1/TransDtsDescs/Underling/?datestart=' + dtstart + '&datestop=' + dtstop + '&status=' + this.state.currentstatus, "method:'GET'"),
            auth.fetchWithToken(webapiurl.data + '/api/v1/TransDtsDescs/Year', "method:'GET'"),
            auth.fetchWithToken(webapiurl.data + '/api/v1/TransDtsDescs/Month', "method:'GET'")

        ])
            .then(([underlinglist, empdtsinfo, yearlist, monthlist]) => this.setState({
                underlinglist: underlinglist.data,
                jsondata: empdtsinfo.data,
                yearlist: yearlist.data,
                monthlist: monthlist.data
            }))
            .catch(error => console.log(error));
    }


  
    //************************************************************************************************************************************

    async fetchData(e) {

        const webapiurl = await axios.get('api/ConfigFromAppSetting')
        let url = ''
        const dtstart = moment(this.state.startDate).format('YYYY-MM-DD 00:00:00')
        const dtstop = moment(this.state.stopDate).format('YYYY-MM-DD 23:59:59')

        if (this.state.underlingDropdownId == 0) {
            // ดาวน์โหลดรายงานทั้งหมด  
           
            url = '/api/v1/TransDtsDescs/Report?dtStart=' + dtstart + '&dtStop=' + dtstop
        } else {
            // ดาวน์โหลดรายงาน byid
            
           // console.log('id ' + this.state.underlingDropdownId)
            url = '/api/v1/TransDtsDescs/Report/' + this.state.underlingDropdownId + '?dtStart=' + dtstart + '&dtStop=' + dtstop
        }

        //this.setState({
        //    urltest: webapiurl.data + url,

        //})
        //const headers = { 'Content-Type': 'application/pplication/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' }
        //headers['Authorization'] = 'Bearer ' + auth.getToken()
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
        const filename = 'Labor Charge_' + startName + ' ถึง ' + stopName + '.xlsx'
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
                    handleClick={this.handleClick}
                    underlingDropdownName={this.state.underlingDropdownName}
                    handleDropdownChange={this.handleDropdownChange}
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



