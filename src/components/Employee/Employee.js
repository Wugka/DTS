import React, { Component } from 'react'
import AuthService from '../AuthService';
import axios from 'axios'
import { Container } from 'reactstrap'
import TableResult from './TableResult'
import SearchBar from './SearchBar'
import moment from 'moment'
import { config } from '@fortawesome/fontawesome-svg-core';
var auth = new AuthService()

export default class Employee extends Component {
    constructor() {
        super()
        this.state = {
            searchtext: '', EmployeeArray: [], currentPage: 1, paging: {}, dropdownlist: [], DropdownName: 'ทั้งหมด', DropdownID: 0, MaxEmpId: 0
            , PositionsArray: [], DepartmentsArray: [], DevisionsArray: [], SectionsArray: [], EmployeesHeadsArray: [],
            GroupUsersArray: [], isHeadEmp: false, posId: 0, grpUsName: 'กรุณาเลือก', grpUsId: 0, empHeadName: 'กรุณาเลือก', empHeadId: 0, counter: 0,
            posName: 'กรุณาเลือก', posId: 0, divId: 0, divName: 'กรุณาเลือก'
        }
        this.fetchData = this.fetchData.bind(this)
        this.handlePagination = this.handlePagination.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.handleDropdownChange = this.handleDropdownChange.bind(this)
        this.statesearchbox = this.statesearchbox.bind(this)
        this.handleisHeadEmp = this.handleisHeadEmp.bind(this)
        this.handleDropdownChangeSearch = this.handleDropdownChangeSearch.bind(this)
    }

    handleClick(e) {
        this.setState({
            searchText: '',
            currentPage: 1,
        })
        this.fetchData(e)
       
    }
    statesearchbox(evt) {
        const event = evt.currentTarget.value;
        this.setState({ searchtext: event, currentPage: 1 })
    }
    handleDropdownChangeSearch(e, name, nameId) {
        console.log('name ' + name + ' value ' + e.value + ' nameId ' + nameId)
        let value = e.value
        let label = e.label

       if (name === "Positions") {
           this.setState({
               posId: value,
               posName: label,

               empHeadName: 'กรุณาเลือก',
               empHeadId: 0,
               grpUsId: 0,
               grpUsName: 'กรุณาเลือก',
               divId: 0, divName: 'กรุณาเลือก'
            })
        }
        //if (name === "Departments") {
        //    this.setState({
        //        depId: value,
        //        depName: label,
        //    })
        //}
        if (name === "Divisions") {
            this.setState({
                divId: value,
                divName: label,
                empHeadName: 'กรุณาเลือก',
                empHeadId: 0,
                grpUsId: 0,
                grpUsName: 'กรุณาเลือก',               
                posName: 'กรุณาเลือก',
                posId: 0,
            })
        }
        //if (name === "Sections") {
        //    this.setState({
        //        secId: value,
        //        secName: label,
        //    })
        //}
        if (name === "EmployeesHeads") {
            this.setState({
                empHeadId: value,
                empHeadName: label,
                grpUsId: 0,
                grpUsName: 'กรุณาเลือก',
                posName: 'กรุณาเลือก',
                posId: 0,
                divId: 0,
                divName: 'กรุณาเลือก'
            })
        }
        if (name === "GroupUsers") {
            this.setState({
                grpUsId: value,
                grpUsName: label,
                empHeadName: 'กรุณาเลือก',
                empHeadId: 0,
                posName: 'กรุณาเลือก',
                posId: 0,
                divId: 0,
                divName: 'กรุณาเลือก'
            })
        }

    }
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
    handleisHeadEmp() {
        this.setState({ isHeadEmp: !this.state.isHeadEmp })
    }
    handleDropdownChange(e) {
       
        let value = e.value
        let label = e.label
        let counter = this.state.counter

        this.setState({
            DropdownName: label,
            DropdownID: value,
            searchtext: '',
            grpUsId: 0,
            grpUsName: 'กรุณาเลือก',
            empHeadName: 'กรุณาเลือก',
            empHeadId: 0,
            posName: 'กรุณาเลือก',
            posId: 0,
            divId: 0,
            divName: 'กรุณาเลือก',
            counter: counter + 1
           

        })
    }

    async componentDidMount() {
        const webapiurl = await axios.get('api/ConfigFromAppSetting')

        const options = [
            { ID: 0, Name: 'ทั้งหมด' },
            { ID: 1, Name: 'ชื่อพนักงาน' },
            { ID: 2, Name: 'อีเมล์' },
            { ID: 3, Name: 'กลุ่มผู้ใช้งาน' },
            { ID: 4, Name: 'เบอร์มือถือ' },
            { ID: 5, Name: 'ตำแหน่ง' },
            { ID: 6, Name: 'แผนก' },
            { ID: 7, Name: 'หัวหน้างาน'}
        ]
      //  console.log('option ' + JSON.stringify(options))
       // console.log('searchtext ' + this.state.searchtext)
        Promise.all([
            auth.fetchWithToken(webapiurl.data + '/api/v1/Employees/Search/page?SelId=0&search=' + this.state.searchtext + '&grpUsId=0&empHeadId=0&posId=0&divId=0&PageNumber=1&PageSize=10', "method:'GET'"),
            auth.fetchWithToken(webapiurl.data + '/api/v1/Positions', "method:'GET'"),
            auth.fetchWithToken(webapiurl.data + '/api/v1/Departments', "method:'GET'"),
            auth.fetchWithToken(webapiurl.data + '/api/v1/Devisions', "method:'GET'"),
            auth.fetchWithToken(webapiurl.data + '/api/v1/Sections', "method:'GET'"),
            auth.fetchWithToken(webapiurl.data + '/api/v1/EmployeesHeads', "method:'GET'"),
            auth.fetchWithToken(webapiurl.data + '/api/v1/GroupUsers/Emp',"method:'GET'"),
            ])      
            .then(([employee, Positions, Departments, Devisions, Sections, EmployeesHeads, GroupUsers]) => this.setState({
                EmployeeArray: employee.data.items,
                paging: employee.data.paging,
                MaxEmpId: employee.data.maxEmployee.maxEmpID,
                dropdownlist: options,
                PositionsArray: Positions.data,
                DepartmentsArray: Departments.data,
                DevisionsArray: Devisions.data,
                SectionsArray: Sections.data,
                EmployeesHeadsArray: EmployeesHeads.data,
                GroupUsersArray: GroupUsers.data,
               // isHeadEmp: true,
            }))
            
            .catch(error => console.log(error));
    }
    async fetchData() {
        const webapiurl = await axios.get('api/ConfigFromAppSetting')
        console.log('Empid ' + this.state.DropdownID + ' search ' + this.state.searchtext + 'PageNumber=' + this.state.currentPage + ' posId ' + this.state.posId + '  grpUsId ' + this.state.grpUsId + ' empHeadId' + this.state.empHeadId + ' posId ' + this.state.posId + ' divId ' + this.state.divId)
        Promise.all([
            auth.fetchWithToken(webapiurl.data + '/api/v1/Employees/Search/page?SelId=' + this.state.DropdownID + '&search=' + this.state.searchtext + '&grpUsId=' + this.state.grpUsId + '&empHeadId=' + this.state.empHeadId + '&posId=' + this.state.posId + '&divId=' + this.state.divId + '&PageNumber=' + this.state.currentPage + '&PageSize=10', "method:'GET'"),
            auth.fetchWithToken(webapiurl.data + '/api/v1/Positions', "method:'GET'"),
            auth.fetchWithToken(webapiurl.data + '/api/v1/Departments', "method:'GET'"),
            auth.fetchWithToken(webapiurl.data + '/api/v1/Devisions', "method:'GET'"),
            auth.fetchWithToken(webapiurl.data + '/api/v1/Sections', "method:'GET'"),
            auth.fetchWithToken(webapiurl.data + '/api/v1/EmployeesHeads', "method:'GET'"),
            auth.fetchWithToken(webapiurl.data + '/api/v1/GroupUsers/Emp', "method:'GET'"),
            ])

            .then(([employee, Positions, Departments, Devisions, Sections, EmployeesHeads, GroupUsers]) => this.setState({
                EmployeeArray: employee.data.items,
                paging: employee.data.paging,
                MaxEmpId: employee.data.maxEmployee.maxEmpID,
                PositionsArray: Positions.data,
                DepartmentsArray: Departments.data,
                DevisionsArray: Devisions.data,
                SectionsArray: Sections.data,
                EmployeesHeadsArray: EmployeesHeads.data,
                GroupUsersArray: GroupUsers.data,

            })
            )
            .catch(error => console.log(error));
    }

    
    render() {
       // console.log('EmployeeArray' + JSON.stringify(this.state.EmployeeArray))
       // console.log('PositionsArray ' + JSON.stringify(this.state.PositionsArray))
       // console.log('this.state.MaxEmpId Employess ' + this.state.MaxEmpId)
        return (

            <Container>
                <SearchBar
                    fetchData={this.fetchData}
                    handlePagination={this.handlePagination}
                    paging={this.state.paging}
                    currentPage={this.state.currentPage}
                    handleClick={this.handleClick}

                    dropdownlist={this.state.dropdownlist}
                    handleDropdownChange={this.handleDropdownChange}
                    DropdownName={this.state.DropdownName}
                    searchtext={this.state.searchtext}
                    statesearchbox={this.statesearchbox}
                    MaxEmpId={this.state.MaxEmpId}
                    PositionsArray={this.state.PositionsArray}
                    DepartmentsArray={this.state.DepartmentsArray}
                    DevisionsArray={this.state.DevisionsArray}
                    SectionsArray={this.state.SectionsArray}
                    EmployeesHeadsArray={this.state.EmployeesHeadsArray}
                    GroupUsersArray={this.state.GroupUsersArray}
                    handleisHeadEmp={this.handleisHeadEmp}
                    isHeadEmp={this.state.isHeadEmp}
                    DropdownID={this.state.DropdownID}
                    handleDropdownChangeSearch={this.handleDropdownChangeSearch}
                    grpUsName={this.state.grpUsName}
                    empHeadName={this.state.empHeadName}
                    empHeadId={this.state.empHeadId}
                    grpUsId={this.state.grpUsId}
                    counter={this.state.counter}
                    posName={this.state.posName}
                    posId={this.state.posId}
                    divId={this.state.divId}
                    divName={this.state.divName}
       />
                <TableResult
                    EmployeeArray={this.state.EmployeeArray}
                    fetchData={this.fetchData}
                    handlePagination={this.handlePagination}
                    paging={this.state.paging}
                    currentPage={this.state.currentPage}
                    PositionsArray={this.state.PositionsArray}
                    DepartmentsArray={this.state.DepartmentsArray}
                    DevisionsArray={this.state.DevisionsArray}
                    SectionsArray={this.state.SectionsArray}
                    EmployeesHeadsArray={this.state.EmployeesHeadsArray}
                    GroupUsersArray={this.state.GroupUsersArray}
                    handleisHeadEmp={this.handleisHeadEmp}
                    isHeadEmp={this.state.isHeadEmp}
                />

            </Container>
        )



    }
}