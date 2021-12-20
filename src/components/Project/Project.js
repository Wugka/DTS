import React, { Component } from 'react'
import SearchBar from './SearchBar';
import TableResult from './TableResult';
import AuthService from '../AuthService';
import axios from 'axios'
import { Container } from 'reactstrap'
import '../../css/Project.css'

var auth = new AuthService()

export default class Project extends Component {
    constructor() {
        super()
        this.state = {
            searchText: '', projectArray: [], projectStatusArray: [], projectTypeArray: [], projectWorkArray: [], projectGroupArray: [], customerArray:[], roleArray:[], employeeArray:[]
            , currentPage: 1, paging: {}, maxProjectId: 0, projectDropdownOptionId: 1, projectDropdownOptionName: 'ทั้งหมด' // 1 : 'ทั้งหมด',2 : 'รหัสโครงการ', 3: 'ชื่อโครงการ', 4: 'สถานะโครงการ', 5: สถานะ
            , projectStatusOptionId: 6, projectStatusDropdownOptionName: 'เปิดใช้งาน' // statusoptionid : 6 = เปิดใช้งาน, 7 = ปิดใช้งาน
            , projectStatusSubOptionId: 1, projectStatusSubDropdownOptionName: ''
            ,counter : 0
        }
        this.fetchData = this.fetchData.bind(this)
        this.handlePagination = this.handlePagination.bind(this)
        this.handleTextChange = this.handleTextChange.bind(this)
        this.handleDropdownChange = this.handleDropdownChange.bind(this)
        this.handleDropdownStatusChange = this.handleDropdownStatusChange.bind(this)
    }


    //*******************************************************************************************************************************************************************************

    handleTextChange(e) {
        const value = e.target.value

        this.setState({ searchText: value, currentPage: 1 }, function () {
            this.fetchData()
        })

    }

    //*******************************************************************************************************************************************************************************

    handleDropdownChange(e) {
        let value = e.value
        let label = e.label
        let counter = this.state.counter

        this.setState({
            projectDropdownOptionName: label, 
            projectDropdownOptionId: value,
            projectStatusOptionId:6,
            searchText: '',
            currentPage: 1,
            counter: counter + 1
        }, () => this.fetchData())

    }

    handleDropdownStatusChange(e,name,nameId) {
        let value = e.value
        let label = e.label

        this.setState({
            [name]: label,
            [nameId]: value,
            currentPage: 1
        }, () => this.fetchData())

    }

    //*******************************************************************************************************************************************************************************

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

    //*******************************************************************************************************************************************************************************

    async componentDidMount() {
        const webapiurl = await axios.get('api/ConfigFromAppSetting')

        Promise.all([
            auth.fetchWithToken(webapiurl.data + '/api/v1/Projects/page?PageNumber=1&PageSize=10', "method:'GET'"),
            auth.fetchWithToken(webapiurl.data + '/api/v1/ProjectStatus', "method:'GET'"),
            auth.fetchWithToken(webapiurl.data + '/api/v1/ProjectTypes', "method:'GET'"),
            auth.fetchWithToken(webapiurl.data + '/api/v1/ProjectWorks', "method:'GET'"),
            auth.fetchWithToken(webapiurl.data + '/api/v1/Customers', "method:'GET'"),
            auth.fetchWithToken(webapiurl.data + '/api/v1/Roles', "method:'GET'"),
            auth.fetchWithToken(webapiurl.data + '/api/v1/Employees/Underling/Self', "method:'GET'"),
            auth.fetchWithToken(webapiurl.data + '/api/v1/ProjectGroup', "method:'GET'"),
        ])
            .then(([project, projectStatus,projectType,projectWork,customer,role,emp,projectGroup]) => this.setState({
                projectArray: project.data.items,
                paging: project.data.paging,
                maxProjectId: project.data.maxProject.maxProjectID,
                projectStatusArray: projectStatus.data,
                projectStatusSubDropdownOptionName: projectStatus.data.length > 0 ? projectStatus.data[0].projStatusName : '',
                projectTypeArray: projectType.data,
                projectWorkArray: projectWork.data,
                projectGroupArray: projectGroup.data,
                customerArray: customer.data,
                roleArray: role.data,
                employeeArray: emp.data
            }))
            .catch(error => console.log(error));
    }

    //*******************************************************************************************************************************************************************************

    async fetchData() {

        const webapiurl = await axios.get('api/ConfigFromAppSetting')
        let url = '/api/v1/Projects/page?PageNumber=' + this.state.currentPage + '&PageSize=10'
        let searchStr = this.state.searchText
        if (searchStr != null && searchStr.length > 0) {
            url = '/api/v1/Projects/Search/page?PageNumber=' + this.state.currentPage + '&PageSize=10&search=' + searchStr + '&optionId=' + this.state.projectDropdownOptionId
        }
        else if (this.state.projectDropdownOptionId == '5') {
            url = '/api/v1/Projects/Search/page?PageNumber=' + this.state.currentPage + '&PageSize=10&search=' + searchStr + '&optionId=' + this.state.projectStatusOptionId
        }
        else if (this.state.projectDropdownOptionId == '4') {
            searchStr = this.state.projectStatusSubDropdownOptionName
            url = '/api/v1/Projects/Search/page?PageNumber=' + this.state.currentPage + '&PageSize=10&search=' + searchStr + '&optionId=' + this.state.projectDropdownOptionId
                   
        }

        auth.fetchWithToken(webapiurl.data + url, "method:'GET'")
            .then(projectInfo => this.setState({
                projectArray: projectInfo.data.items,
                paging: projectInfo.data.paging,
                maxProjectId: projectInfo.data.maxProject.maxProjectID
            })
            )
            .catch(error => console.log(error));
    }

    //*******************************************************************************************************************************************************************************



    render() {

        return (
            <Container>
                <SearchBar
                    fetchData={this.fetchData}
                    handlePagination={this.handlePagination}
                    paging={this.state.paging}
                    currentPage={this.state.currentPage}
                    searchText={this.state.searchText}
                    handleTextChange={this.handleTextChange}
                    handleDropdownChange={this.handleDropdownChange}
                    projectDropdownOptionName={this.state.projectDropdownOptionName}
                    projectDropdownOptionId={this.state.projectDropdownOptionId}
                    projectStatusSubOptionId={this.state.projectStatusSubOptionId}
                    projectStatusSubDropdownOptionName={this.state.projectStatusSubDropdownOptionName}
                    projectStatusArray={this.state.projectStatusArray}
                    projectTypeArray={this.state.projectTypeArray}
                    projectWorkArray={this.state.projectWorkArray}
                    customerArray={this.state.customerArray}
                    roleArray={this.state.roleArray}
                    employeeArray={this.state.employeeArray}
                    projectGroupArray={this.state.projectGroupArray}
                    handleDropdownStatusChange={this.handleDropdownStatusChange}
                    counter={this.state.counter}
                />
                <TableResult
                    projectArray={this.state.projectArray}
                    projectStatusArray={this.state.projectStatusArray}
                    fetchData={this.fetchData}
                    handlePagination={this.handlePagination}
                    paging={this.state.paging}
                    currentPage={this.state.currentPage}
                    maxProjectId={this.state.maxProjectId}
                    projectStatusArray={this.state.projectStatusArray}
                    projectTypeArray={this.state.projectTypeArray}
                    projectWorkArray={this.state.projectWorkArray}
                    customerArray={this.state.customerArray}
                    roleArray={this.state.roleArray}
                    employeeArray={this.state.employeeArray}
                    projectGroupArray={this.state.projectGroupArray}
                />
            </Container>
            )
    }
}