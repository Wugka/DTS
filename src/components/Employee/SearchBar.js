import React, { Component } from 'react'
import { Row, Col, Button, Label, FormGroup, Input } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AddEditEmployee from '../Employee/AddEditEmployee'
import Dropdownlist from '../Employee/DropdownList'
import Select from 'react-select'
import { config } from '@fortawesome/fontawesome-svg-core';
export default class SearchBar extends Component {
    constructor() {
        super()
        this.state = {
            addClick: false, item: {
                empCode: '',
                empId: '', empName: '', posName: '', depName: '', divName: '', secName: '', empHeadName: '', empInphone: '', empMobile: '',
                empEmail: '', username: '', grpUsName: '', grpUsId: 0, empHeadName: '', empHeadId: 0, posName: '', posId: 0, divId: 0, divName:''
            }, showModal: true, searchtext: '', ishead: false
        }
        this.handleAddEditEmployee = this.handleAddEditEmployee.bind(this)
        this.closeModal = this.closeModal.bind(this)
        this.handleisHeadEmpResult = this.handleisHeadEmpResult.bind(this)
        
    }

    handleAddEditEmployee() {
        this.setState(({ addClick: true, showModal: true }))
    }
    closeModal() {
        this.setState({ addClick: false });
    }
    handleisHeadEmpResult() {
        this.setState({ ishead: !this.state.ishead })
    }
    
    render() {
        //  console.log('maxid ' + this.props.MaxEmpId)
        const underlingOptions = []

        //underlingOptions.push({ value: 0, label: 'ทั้งหมด' })
        const underlinglist = this.props.dropdownlist.map((item, key) => {
            underlingOptions.push({ key: key, value: item.ID, label: item.Name })
        })

        let GroupUsersArray = []
      //  console.log('this.props.GroupUsersArray ' + JSON.stringify(this.props.GroupUsersArray))
         //GroupUsersArray.push({ value: 0, label: 'กรุณาเลือก' })
        const GroupUsers = this.props.GroupUsersArray ? this.props.GroupUsersArray.map((item, key) => {
             GroupUsersArray.push({ key: key, value: item.grpUsId, label: item.grpUsName })
        }) : GroupUsersArray.push({ key: 0, value: 0, label: 'ไม่พบข้อมูล' })
        let dropdownorinput = ''

        //console.log(JSON.stringify(this.props.EmployeesHeadsArray))

        let EmployeesHeadsArray = []
        const EmployeesHeads = this.props.EmployeesHeadsArray ? this.props.EmployeesHeadsArray.map((item, key) => {
            EmployeesHeadsArray.push({ key: key, value: item.empHeadId, label: item.empHeadName })
        }) : EmployeesHeadsArray.push({ key: 0, value: 0, label: 'ไม่พบข้อมูล' })

       // console.log(JSON.stringify(this.props.PositionsArray))
        let PositionsArray = []
        const Position = this.props.PositionsArray ? this.props.PositionsArray.map((item, key) => {
            PositionsArray.push({ key: key, value: item.posId, label: item.posName })
        }) : PositionsArray.push({ key: 0, value: 0, label: 'ไม่พบข้อมูล' })

        //console.log(JSON.stringify(this.props.DevisionsArray))
        let DevisionsArray = []
        const Devisions = this.props.DevisionsArray ? this.props.DevisionsArray.map((item, key) => {
            DevisionsArray.push({ key: key, value: item.divId, label: item.divName })
        }) : DevisionsArray.push({ key: 0, value: 0, label: 'ไม่พบข้อมูล' })

        if (this.props.DropdownID === 3) {
            console.log('grpUsName ' + this.props.grpUsName + ' grpUsId ' + this.props.grpUsId + ' this.props.counter  ' + this.props.counter)
            dropdownorinput = <Select
                classNamePrefix='selectsearchdtsblackstyle'
                defaultValue={{ label: this.props.grpUsName, value: this.props.grpUsId }}
                placeholder={this.props.grpUsName}
                options={GroupUsersArray}
                isSearchable={true}
                key={this.props.counter}
                onChange={(event) => this.props.handleDropdownChangeSearch(event, 'GroupUsers', 'grpUsId')}
                noOptionsMessage={() => 'ไม่พบข้อมูล'}
            />
        }
        else if (this.props.DropdownID === 5) {
            //ค้นหาตำแหน่ง position
            dropdownorinput = <Select
                classNamePrefix='selectsearchdtsblackstyle'
                defaultValue={{ label: this.props.posName, value: this.props.posId }}
                placeholder={this.props.posName}
                options={PositionsArray}
                isSearchable={true}
                key={this.props.counter}
                onChange={(event) => this.props.handleDropdownChangeSearch(event, 'Positions', 'posId')}
                noOptionsMessage={() => 'ไม่พบข้อมูล'}
            />
        } else if (this.props.DropdownID === 6) {
             //ค้นหาแผนก Devision
            dropdownorinput = <Select
                classNamePrefix='selectsearchdtsblackstyle'
                defaultValue={{ label: this.props.divName, value: this.props.divId }}
                placeholder={this.props.divName}
                options={DevisionsArray}
                isSearchable={true}
                key={this.props.counter}
                onChange={(event) => this.props.handleDropdownChangeSearch(event, 'Divisions', 'divId')}
                noOptionsMessage={() => 'ไม่พบข้อมูล'}
            />
        }
        else if (this.props.DropdownID === 7) {
            
            console.log('empHeadId ' + this.props.empHeadId + ' empHeadName ' + this.props.empHeadName + ' this.props.counter  ' + this.props.counter )
            dropdownorinput = <Select
                classNamePrefix='selectsearchdtsblackstyle'
                defaultValue={{ label: this.props.empHeadName, value: this.props.empHeadId }}
                placeholder={this.props.empHeadName}
                options={EmployeesHeadsArray}
                isSearchable={true}
                key={this.props.counter}
                onChange={(event) => this.props.handleDropdownChangeSearch(event, 'EmployeesHeads', 'empHeadId')}
                noOptionsMessage={() => 'ไม่พบข้อมูล'}
            />

        } else {

             dropdownorinput = <Input
                 onChange={this.props.statesearchbox}
                 type="text"
                 placeholder='กรอกข้อมูลที่ต้องการค้นหา'
                 value={this.props.searchtext}
                 name="searchtext" id="searchtext"
                 style={{ color: 'white', backgroundColor: '#21375F', border: '1px solid black', height: '30px', borderRadius: 0 }} />
         }
        return (

            <Row style={{ color: 'white' }}>
                <Col lg='12' md='12' sm='12' >
                    <Row style={{ marginBottom: '15px' }}>
                        <Col lg='2' md='5' sm='12' xs='12'>
                            <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'left' }}>
                                <FontAwesomeIcon
                                    onClick={this.handleAddEditEmployee}
                                    icon={['fas', 'plus']}
                                    style={{ color: '#39B54A', margin: '5px', cursor: 'pointer' }}
                                    size='2x' />
                                <span onClick={this.handleAddEditEmployee} style={{ cursor: 'pointer', whiteSpace: 'nowrap' }} > ข้อมูลพนักงาน</span>
                                {this.state.addClick ?
                                    <AddEditEmployee
                                        handleAddEditEmployee={this.handleAddEditEmployee}
                                        showModal={this.state.addClick}
                                        fetchData={this.props.fetchData}
                                        name='add'
                                        item={this.state.item}
                                        closeModal={this.closeModal}
                                        MaxEmpId={this.props.MaxEmpId}
                                        PositionsArray={this.props.PositionsArray}
                                        DepartmentsArray={this.props.DepartmentsArray}
                                        DevisionsArray={this.props.DevisionsArray}
                                        SectionsArray={this.props.SectionsArray}
                                        EmployeesHeadsArray={this.props.EmployeesHeadsArray}
                                        GroupUsersArray={this.props.GroupUsersArray}

                                        handleisHeadEmpResult={this.handleisHeadEmpResult}
                                        ishead={this.state.ishead}
                                    />
                                    : ''}
                            </div>
                        </Col>

                        <Col lg='3' md='5' sm='12' style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', margin: '3px' }}>
                            {/*<Dropdownlist handleDropdownChange={this.props.handleDropdownChange} dropdownlist={this.props.dropdownlist} DropdownName={this.props.DropdownName} />*/}
                            <Select
                                classNamePrefix='selectsearchdtsblackstyle'
                                defaultValue={{ label: this.props.DropdownName, value: this.props.DropdownID }}
                                // name='underling'
                                placeholder={this.props.dropdownlist}
                                options={underlingOptions}
                                isSearchable={true}
                                onChange={(event) => this.props.handleDropdownChange(event)}
                                noOptionsMessage={() => 'ไม่พบข้อมูล'}
                            />


                        </Col>
                        <Col lg='3' md='5' sm='12' style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', margin: '3px' }}>
                            {dropdownorinput}
                            {/*<Input
                                onChange={this.props.statesearchbox}
                                type="text"
                                placeholder='กรอกข้อมูลที่ต้องการค้นหา'
                                value={this.props.searchtext}
                                name="searchtext" id="searchtext"
                                style={{ color: 'white', backgroundColor: '#21375F', border: '1px solid black', height: '30px', borderRadius: 0 }} />*/} 
                            
                        </Col>
                        <Col lg='2' md='2' sm='6' xs='12' style={{ paddingTop: '5px' }}>
                            <Button onClick={this.props.handleClick} size='sm' outline color="danger" style={{ color: 'white' }}>ค้นหา</Button>
                        </Col>
                    </Row>
                </Col>

            </Row>

        )

    }
}
