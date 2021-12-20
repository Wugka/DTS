import React, { Component } from 'react'
import AuthService from '../AuthService';
import axios from 'axios'
import { Container } from 'reactstrap'
import TableResult from './TableResult'
import SearchBar from './SearchBar'

var auth = new AuthService()

export default class RoleInfo extends Component {
    constructor() {
        super()
        this.state = { searchText: '', roleArray: [], currentPage: 1, paging: {}, maxRoleId: 0 }
        this.fetchData = this.fetchData.bind(this)
        this.handlePagination = this.handlePagination.bind(this)
        this.handleTextChange = this.handleTextChange.bind(this)
    }

    //*******************************************************************************************************************************************************************************

    handleTextChange(e) {
        const value = e.target.value

        this.setState({ searchText: value, currentPage:1 }, function () {
            this.fetchData()
        })
        
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

        auth.fetchWithToken(webapiurl.data + '/api/v1/Roles/page?PageNumber=1&PageSize=10', "method:'GET'")
            .then(roleInfo => this.setState({
                roleArray: roleInfo.data.items,
                paging: roleInfo.data.paging,
                maxRoleId: roleInfo.data.maxRole.maxRoleID
            })
            )
            .catch(error => console.log(error));
    }

    //*******************************************************************************************************************************************************************************

    async fetchData() {
        const webapiurl = await axios.get('api/ConfigFromAppSetting')
        let url = '/api/v1/Roles/page?PageNumber=' + this.state.currentPage + '&PageSize=10'
        const searchStr = this.state.searchText
        if (searchStr != null && searchStr.length > 0) {
            url = '/api/v1/Roles/Search/page?PageNumber=' + this.state.currentPage + '&PageSize=10&search=' + searchStr
        }

        auth.fetchWithToken(webapiurl.data + url, "method:'GET'")
            .then(roleInfo => this.setState({
                roleArray: roleInfo.data.items,
                paging: roleInfo.data.paging,
                maxRoleId: roleInfo.data.maxRole.maxRoleID
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
                    maxRoleId={this.state.maxRoleId}
                   
                />

                <TableResult
                    roleArray={this.state.roleArray}
                    fetchData={this.fetchData}
                    handlePagination={this.handlePagination}
                    paging={this.state.paging}
                    currentPage={this.state.currentPage}
                    maxRoleId={this.state.maxRoleId}
                />
            </Container>

        )

    }

}