import React, { Component } from 'react'
import AuthService from '../AuthService';
import axios from 'axios'
import { Container } from 'reactstrap'
import TableResult from './TableResult'
import SearchBar from './SearchBar'
import moment from 'moment'

var auth = new AuthService()

export default class customer extends Component {
    constructor() {
        super()
        this.state = { searchtext: '', CustomerArray: [], currentPage: 1, paging: {}, dropdownlist: [], DropdownName: 'ทั้งหมด', DropdownID: 0,MaxCusId:0  }
        this.fetchData = this.fetchData.bind(this)
        this.handlePagination = this.handlePagination.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.handleDropdownChange = this.handleDropdownChange.bind(this)
        this.statesearchbox = this.statesearchbox.bind(this)
        
    }    
    handleClick(e) {
        this.fetchData(e)
    }
    statesearchbox(evt) {      
        const event = evt.currentTarget.value;
        this.setState({ searchtext: event, currentPage: 1})       
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

    handleDropdownChange(e) {
        //const event = e.currentTarget      
        //const value = event.getAttribute('valuem')
        //const name = event.getAttribute('namem')
        //const idname = event.getAttribute('idnamem')
        //const idval = event.getAttribute('idm')
        //this.setState({
        //    [name]: value,
        //    [idname]: idval
        //})
        let value = e.value
        let label = e.label

        this.setState({
            DropdownName: label,
            DropdownID: value
        })
    }
    async componentDidMount() {
        const webapiurl = await axios.get('api/ConfigFromAppSetting')

        const options = [
            { ID: 0, Name: 'ทั้งหมด' },
            { ID: 1, Name: 'รหัสลูกค้า' },
            { ID: 2, Name: 'ชื่อลูกค้า' },
            { ID: 3, Name: 'ที่อยู่ลูกค้า' },
            { ID: 4, Name: 'เบอร์โทรศัพท์' },
            { ID: 5, Name: 'ชื่อผู้ติดต่อ' }
        ]
      //  console.log('option ' + JSON.stringify(options))
        auth.fetchWithToken(webapiurl.data + '/api/v1/Customers/Search/page?selid=0&search=' + this.state.searchtext + '&PageNumber=1&PageSize=10', "method:'GET'")
            .then(customer => this.setState({
                CustomerArray: customer.data.items,
                paging: customer.data.paging,
                maxcusid: customer.data.maxCustomer.maxCusID,
                dropdownlist: options
            })
            )
            .catch(error => console.log(error));
    }

    async fetchData() {
        const webapiurl = await axios.get('api/ConfigFromAppSetting')
       
     
        auth.fetchWithToken(webapiurl.data + '/api/v1/Customers/Search/page?selid=' + this.state.DropdownID + '&search=' + this.state.searchtext +'&PageNumber=' + this.state.currentPage + '&PageSize=10', "method:'GET'")
            .then(customer => this.setState({
                CustomerArray: customer.data.items,
                paging: customer.data.paging,
                maxcusid: customer.data.maxCustomer.maxCusID
                
            })
            )
            .catch(error => console.log(error));
    }

    render() {

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
                    searchtext={this.searchtext}
                    statesearchbox={this.statesearchbox}
                    MaxCusId={this.state.maxcusid}
                />
                <TableResult
                    CustomerArray={this.state.CustomerArray}
                    fetchData={this.fetchData}
                    handlePagination={this.handlePagination}
                    paging={this.state.paging}
                    currentPage={this.state.currentPage}
                />
            </Container>
        )

    }
}