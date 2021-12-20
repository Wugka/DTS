import React, { Component } from 'react'
import { FormGroup, Input, Modal, ModalHeader, ModalBody, Label, FormFeedback, Row, Col, Button, Form } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AuthService from '../AuthService';
import axios from 'axios'
import swal from 'sweetalert'
import Select from 'react-select'
var auth = new AuthService()

export default class AddEditEmployee extends Component {
    constructor(props) {
        super(props)
      // console.log('props ' + JSON.stringify(props))      
       
        if (props.name === 'edit') {
            this.state = {
                posId: props.item.missionEmployees.posId, depId: props.item.missionEmployees.depId, divId: props.item.missionEmployees.divId,
                secId: props.item.missionEmployees.secId, empHeadId: props.item.missionEmployees.empHeadId, grpUsId: props.item.grpUsId,
                empId: props.item.empId,
                empCode: props.item.empCode, empName: props.item.empName, posName: props.item.posName,
                depName: props.item.depName, divName: props.item.divName, empFag: props.item.empFag,
                secName: props.item.secName/*, empHeadName: props.item.empHeadName*/,
                empInphone: props.item.empInphone, empMobile: props.item.empMobile, empEmail: props.item.empEmail, username: props.item.username,
                grpUsName: props.item.grpUsName, Positions: '', Departments: '', Divisions: '',
                Sections: '', EmployeesHeads: '', GroupUsers: '', error: {}   , handleisHeadEmp: false, ishead: this.props.ishead
            }
        } else {
            this.state = {
                posId: -1, depId: -1, divId: -1, secId: -1, empHeadId: -1, grpUsId: -1,
                empId: props.item.empId,
                empCode: props.item.empCode, empName: props.item.empName, posName: props.item.posName,
                depName: props.item.depName, divName: props.item.divName, empFag: props.item.empFag,
                secName: props.item.secName/*, empHeadName: props.item.empHeadName*/,
                empInphone: props.item.empInphone, empMobile: props.item.empMobile, empEmail: props.item.empEmail, username: props.item.username,
                grpUsName: props.item.grpUsName, Positions: '', Departments: '',  Divisions: '', 
                Sections: '', EmployeesHeads: '', GroupUsers: '', error: {}   , handleisHeadEmp: false, ishead: this.props.ishead
            }
             
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleAddConfirm = this.handleAddConfirm.bind(this)
        this.handleEditConfirm = this.handleEditConfirm.bind(this)
        this.handleDropdownChange = this.handleDropdownChange.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }
    async handleAddConfirm(evt, cm) {
       // console.log('this.state.posId ' + this.state.handleisHeadEmp)
        const webapiurl = await axios.get('api/ConfigFromAppSetting')
        const newError = { ...this.state.error }
        let isError = false
        const empCode = this.state.empCode
        if (!empCode || !empCode.replace(/\s/g, '').length) {
            newError["empCode"] = true
            this.setState({ error: newError })
            swal({ text: 'กรุณากรอกข้อมูลรหัสพนักงาน', icon: 'warning' })
            return
        }
        const empName = this.state.empName
        if (!empName || !empName.replace(/\s/g, '').length) {
            newError["empName"] = true
            this.setState({ error: newError })
            swal({ text: 'กรุณากรอกข้อมูลชื่อ-นามสกุล', icon: 'warning' })
            return
        }
        const posId = this.state.posId
        if (posId == -1) {
            newError["posId"] = true
            this.setState({ error: newError })
            swal({ text: 'กรุณาเลือกข้อมูลตำแหน่ง', icon: 'warning' })
            return
        }
        const depId = this.state.depId
        if (depId == -1) {
            newError["depId"] = true
            this.setState({ error: newError })
            swal({ text: 'กรุณาเลือกข้อมูลฝ่าย', icon: 'warning' })
            return
        }
        const divId = this.state.divId
        if (divId == -1) {
            newError["divId"] = true
            this.setState({ error: newError })
            swal({ text: 'กรุณาเลือกข้อมูลแผนก', icon: 'warning' })
            return
        }
        const secId = this.state.secId
        if (secId == -1) {
            newError["secId"] = true
            this.setState({ error: newError })
            swal({ text: 'กรุณาเลือกข้อมูลกลุ่มงาน', icon: 'warning' })
            return
        }
       

        const empInphone = this.state.empInphone
        if (empInphone.length > 4) {
            newError["empInphone"] = true
            this.setState({ error: newError })
            swal({ text: 'เบอร์ภายใน กรุณากรอกเฉพาะตัวเลข และ ไม่เกิน 4 ตัวอักษร', icon: 'warning' })
            return
        }
        const empMobile = this.state.empMobile
        if (empMobile.length > 10) {
            newError["empMobile"] = true
            this.setState({ error: newError })
            swal({ text: 'เบอร์มือถือ กรุณากรอกเฉพาะตัวเลข และ ไม่เกิน 10 ตัวอักษร', icon: 'warning' })
            return
        }
        const username = this.state.username
        if (!username || !username.replace(/\s/g, '').length || username.length > 8) {    
            newError["username"] = true
            this.setState({ error: newError })
            swal({ text: 'กรุณากรอกข้อมูลชื่อเข้าใช้งานระบบ และ ไม่เกิน 8 ตัวอักษร', icon: 'warning' })
            return
        }
        
        const grpUsId = this.state.grpUsId
        if (grpUsId == -1) {
            newError["grpUsId"] = true
            this.setState({ error: newError })
            swal({ text: 'กรุณาเลือกข้อมูลกลุ่มผู้ใช้งาน', icon: 'warning' })
            return
        }
       

        

        if (this.props.isHeadEmp == true) {
            const jsondata = JSON.stringify({
                empCode: this.state.empCode,
                empName: this.state.empName,
                posName: this.state.posName,
                depName: this.state.depName,
                divName: this.state.divName,
                secName: this.state.secName,
                empHeadName: this.state.empHeadName,
                empInphone: this.state.empInphone,
                empMobile: this.state.empMobile,
                empEmail: this.state.empEmail,
                username: this.state.username,
                grpUsName: this.state.grpUsName,
                ishead: this.props.ishead,
                grpUsId: this.state.grpUsId,
                empFag: this.state.empFag,
                MissionEmployees: {
                    EmployeesHead: {

                    },
                    posId: this.state.posId,
                    depId: this.state.depId,
                    divId: this.state.divId,
                    secId: this.state.secId,
                    empHeadId: this.state.empHeadId
                },
            })

            auth.fetchWithToken(webapiurl.data + '/api/v1/Employees', { method: 'POST', data: jsondata })
                .then(response => {
                    if (auth._IsSuccessResponse(response)) {
                        swal({ text: 'เพิ่มข้อมูลสำเร็จ', icon: 'success' })
                        evt()
                        cm()
                    }
                }).catch(error => {
                    swal({ text: 'ไม่สามารถเพิ่มข้อมูลได้', icon: 'warning' })
                })
        } else {
            const jsondata = JSON.stringify({
                empCode: this.state.empCode,
                empName: this.state.empName,
                posName: this.state.posName,
                depName: this.state.depName,
                divName: this.state.divName,
                secName: this.state.secName,
                empHeadName: this.state.empHeadName,
                empInphone: this.state.empInphone,
                empMobile: this.state.empMobile,
                empEmail: this.state.empEmail,
                username: this.state.username,
                grpUsName: this.state.grpUsName,
                ishead: this.props.ishead,
                grpUsId: this.state.grpUsId,
                empFag: this.state.empFag,
                MissionEmployees: {
                    empHeadId: this.state.empHeadId,
                    posId: this.state.posId,
                    depId: this.state.depId,
                    divId: this.state.divId,
                    secId: this.state.secId
                },
            })

            auth.fetchWithToken(webapiurl.data + '/api/v1/Employees', { method: 'POST', data: jsondata })
                .then(response => {
                    if (auth._IsSuccessResponse(response)) {
                        swal({ text: 'เพิ่มข้อมูลสำเร็จ', icon: 'success' })
                        evt()
                        cm()
                    }
                }).catch(error => {
                    if (error.response && error.response.data && error.response.data.message) {
                        swal({ text: error.response.data.message, icon: 'warning' })
                    }
                    else {
                        swal({ text: 'ไม่สามารถเพิ่มข้อมูลได้', icon: 'warning' })
                    }

                })
        }



    }
    async handleEditConfirm(evt, cm) {
      //  console.log('handleeditconfirm grpUsId ' + this.props.item.grpUsId)

        const webapiurl = await axios.get('api/ConfigFromAppSetting')

        const newError = { ...this.state.error }
        let isError = false
        const empCode = this.state.empCode
        if (!empCode || !empCode.replace(/\s/g, '').length) {
            newError["empCode"] = true
            this.setState({ error: newError })
            swal({ text: 'กรุณากรอกข้อมูลรหัสพนักงาน', icon: 'warning' })
            return
        }
        const empName = this.state.empName
        if (!empName || !empName.replace(/\s/g, '').length) {
            newError["empName"] = true
            this.setState({ error: newError })
            swal({ text: 'กรุณากรอกข้อมูลชื่อ-นามสกุล', icon: 'warning' })
            return
        }
        const posId = this.state.posId
        if (posId == -1) {
            newError["posId"] = true
            this.setState({ error: newError })
            swal({ text: 'กรุณาเลือกข้อมูลตำแหน่ง', icon: 'warning' })
            return
        }
        const depId = this.state.depId
        if (depId == -1) {
            newError["depId"] = true
            this.setState({ error: newError })
            swal({ text: 'กรุณาเลือกข้อมูลฝ่าย', icon: 'warning' })
            return
        }
        const divId = this.state.divId
        if (divId == -1) {
            newError["divId"] = true
            this.setState({ error: newError })
            swal({ text: 'กรุณาเลือกข้อมูลแผนก', icon: 'warning' })
            return
        }
        const secId = this.state.secId
        if (secId == -1) {
            newError["secId"] = true
            this.setState({ error: newError })
            swal({ text: 'กรุณาเลือกข้อมูลกลุ่มงาน', icon: 'warning' })
            return
        }
        const empMobile = this.state.empMobile
        if (empMobile.length > 10) {
            newError["empMobile"] = true
            this.setState({ error: newError })
            swal({ text: 'เบอร์มือถือ กรุณากรอกเฉพาะตัวเลข และ ไม่เกิน 10 ตัวอักษร', icon: 'warning' })
            return
        }
        const empInphone = this.state.empInphone
       // console.log(empInphone)
        if (empInphone.length > 4) {
            newError["empInphone"] = true
            this.setState({ error: newError })
            swal({ text: 'เบอร์ภายใน กรุณากรอกเฉพาะตัวเลข และ ไม่เกิน 4 ตัวอักษร', icon: 'warning' })
            return
        }
        const grpUsId = this.state.grpUsId
        if (grpUsId == -1) {
            newError["grpUsId"] = true
            this.setState({ error: newError })
            swal({ text: 'กรุณาเลือกข้อมูลกลุ่มผู้ใช้งาน', icon: 'warning' })
            return
        }
        const username = this.state.username
      
        if (!username || !username.replace(/\s/g, '').length || username.length > 8) { // เหลือเช็คว่าเป็น int ไหม        
            newError["username"] = true
            this.setState({ error: newError })
            swal({ text: 'กรุณากรอกข้อมูลชื่อเข้าใช้งานระบบ และ ไม่เกิน 8 ตัวอักษร', icon: 'warning' })
            return
        }     
        const jsondata = JSON.stringify({
            empId: this.state.empId,
            empCode: this.state.empCode,
            empName: this.state.empName,
            posName: this.state.posName,
            depName: this.state.depName,
            divName: this.state.divName,
            secName: this.state.secName,
            empHeadName: this.state.empHeadName,
            empInphone: this.state.empInphone,
            empMobile: this.state.empMobile,
            empEmail: this.state.empEmail,
            username: this.state.username,
            grpUsName: this.state.grpUsName,
            ishead: this.props.ishead,
            grpUsId: this.state.grpUsId,
            empFag: this.state.empFag,
            MissionEmployees: {
                EmployeesHead: {

                },
                posId: this.state.posId,
                depId: this.state.depId,
                divId: this.state.divId,
                secId: this.state.secId,
                empHeadId: this.state.empHeadId
            },

        })

        auth.fetchWithToken(webapiurl.data + '/api/v1/Employees', { method: 'PUT', data: jsondata })
            .then(response => {
                if (auth._IsSuccessResponse(response)) {
                    swal({ text: 'แก้ไขข้อมูลสำเร็จ', icon: 'success' })
                    evt()
                    cm()
                }
            }).catch(error => {
                swal({ text: 'ไม่่สามารถแก้ไขข้อมูลได้', icon: 'warning' })
            })

    }
    handleClick(e) {
        this.setState({ handleisHeadEmp: true })
    }

    handleChange(e) {
        const name = e.target.name
        const val = e.target.value

        this.setState({
            [name]: val
        })
    }
    handleDropdownChange(e, name, nameId) {
       // console.log('name ' + name + ' value ' + e.value + ' nameId ' + nameId)
        let value = e.value
        let label = e.label

        if (name === "Positions") {
            this.setState({
                posId: value,
                posName : label,
            })
        }
        if (name === "Departments") {
            this.setState({
                depId: value,
                depName: label,
            })
        }
        if (name === "Divisions") {
            this.setState({
                divId: value,
                divName :label,
            })
        }
        if (name === "Sections") {
            this.setState({
                secId: value,
                secName: label,
            })
        }
        if (name === "EmployeesHeads") {
            this.setState({
                empHeadId: value,
                empHeadName: label,
            })
        }
        if (name === "GroupUsers") {
            this.setState({
                grpUsId: value,
                grpUsName: label,
            })
        }
        //this.setState({
        //    [name]: label,
        //    [nameId]: value
        //})
    }
    render() {
        let header = ''
        let confirmBtn = ''
        let MaxEmpId = ''
        let PositionsArray = []
        let DepartmentsArray = []
        let DivisionsArray = []
        let SectionsArray = []
        let EmployeesHeadsArray = []
        let GroupUsersArray = []
        let SelectPosition = ''  
        let SelectDeparment = ''
        let SelectDevision = ''
        let SelectSection = ''
        let SelectEmployeeHead = ''
        let SelectGroupUser = ''
        let radioHeadEmp = ''
        if (this.props.name === 'edit') {
            header = <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                <FontAwesomeIcon icon={['fas', 'edit']} style={{ color: '#39B54A', margin: '5px', }} size='1x' /> <span style={{ fontSize: '16px' }}> แก้ไขข้อมูลพนักงาน</span>
            </div>
          //  MaxEmpId = <Input type="text" defaultValue={this.state.empCode} name="empCode" id="empCode" style={{ color: 'grey', backgroundColor: '#21375F', border: '1px solid black', marginBottom: '5px' }} readOnly />
            confirmBtn = <Button onClick={() => this.handleEditConfirm(this.props.fetchData, this.props.closeModal)} outline color="danger" style={{ color: 'white', margin: '5px' }}>แก้ไข</Button>
            SelectPosition = <Select
                styles={{
                    control: styles => ({
                        ...styles,
                        borderColor: this.state.error['posId'] === true ? 'red !important' : ''
                    })
                }} 
                    classNamePrefix='selectsearchdtsblackstyle'
                    defaultValue={{ label: this.props.item.missionEmployees.position.posName, value: this.props.item.missionEmployees.position.posId }}
                    name='Positions'
                    placeholder={this.state.Positions}
                    options={PositionsArray}
                    isSearchable={true}
                    onChange={(event) => this.handleDropdownChange(event, 'Positions', 'posId')}
                    noOptionsMessage={() => 'ไม่พบข้อมูล'}
            />
            SelectDeparment = <Select
                styles={{
                    control: styles => ({
                        ...styles,
                        borderColor: this.state.error['depId'] === true ? 'red !important' : ''
                    })
                }} 
                classNamePrefix='selectsearchdtsblackstyle'
                defaultValue={{ label: this.props.item.missionEmployees.department.depName, value: this.props.item.missionEmployees.department.depId }}
                placeholder={this.state.Departments}
                options={DepartmentsArray}
                isSearchable={true}
                onChange={(event) => this.handleDropdownChange(event, 'Departments', 'depId')}
                noOptionsMessage={() => 'ไม่พบข้อมูล'}
            />
            SelectDevision = <Select
                styles={{
                    control: styles => ({
                        ...styles,
                        borderColor: this.state.error['divId'] === true ? 'red !important' : ''
                    })
                }} 
                classNamePrefix='selectsearchdtsblackstyle'
                defaultValue={{ label: this.props.item.missionEmployees.devision.divName, value: this.props.item.missionEmployees.devision.divId }}
                placeholder={this.state.Divisions}
                options={DivisionsArray}
                isSearchable={true}
                onChange={(event) => this.handleDropdownChange(event, 'Divisions', 'divId')}
                noOptionsMessage={() => 'ไม่พบข้อมูล'}
            />
            SelectSection = <Select
                styles={{
                    control: styles => ({
                        ...styles,
                        borderColor: this.state.error['secId'] === true ? 'red !important' : ''
                    })
                }} 
                classNamePrefix='selectsearchdtsblackstyle'
                defaultValue={{ label: this.props.item.missionEmployees.section.secName, value: this.props.item.missionEmployees.section.secId }}
                placeholder={this.state.Sections}
                options={SectionsArray}
                isSearchable={true}
                onChange={(event) => this.handleDropdownChange(event, 'Sections', 'secId')}
                noOptionsMessage={() => 'ไม่พบข้อมูล'}
            />
          
            SelectEmployeeHead = <Select
                classNamePrefix='selectsearchdtsblackstyle'
                defaultValue={{ label: this.props.item.missionEmployees.employeesHead == null ? this.state.EmployeesHeads : this.props.item.missionEmployees.employeesHead.empHeadName, value: this.props.item.missionEmployees.empHeadId }}
                placeholder={this.state.EmployeesHeads}
                options={EmployeesHeadsArray}
                isSearchable={true}
                onChange={(event) => this.handleDropdownChange(event, 'EmployeesHeads', 'empHeadId')}
                noOptionsMessage={() => 'ไม่พบข้อมูล'}
            />
            SelectGroupUser = <Select
                styles={{
                    control: styles => ({
                        ...styles,
                        borderColor: this.state.error['grpUsId'] === true ? 'red !important' : ''
                    })
                }} 
                classNamePrefix='selectsearchdtsblackstyle'
                defaultValue={{ label: this.props.item.groupUser.grpUsName, value: this.props.item.grpUsId }}
                placeholder={this.state.GroupUsers}
                options={GroupUsersArray}
                isSearchable={true}
                onChange={(event) => this.handleDropdownChange(event, 'GroupUsers', 'grpUsId')}
                noOptionsMessage={() => 'ไม่พบข้อมูล'}
            />
            radioHeadEmp = <Col sm={8}>
                {this.props.ishead ?
                    <FontAwesomeIcon icon={['far', 'dot-circle']} size='lg' style={{ color: "red", cursor: 'pointer' }} onClick={this.props.handleisHeadEmpResult} /> :
                    <FontAwesomeIcon icon={['far', 'circle']} size='lg' style={{ color: "red", cursor: 'pointer' }} onClick={this.props.handleisHeadEmpResult} />
                }

            </Col>
        }
        else {
            header = <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                <FontAwesomeIcon icon={['fas', 'plus']} style={{ color: '#39B54A', margin: '5px', }} size='1x' /> <span style={{ fontSize: '16px' }}> เพิ่มข้อมูลพนักงาน</span>
            </div>
           // MaxEmpId = <Input type="text" defaultValue={this.state.empCode} name="empCode" id="empCode" style={{ color: 'grey', backgroundColor: '#21375F', border: '1px solid black', marginBottom: '5px' }} readOnly />
            confirmBtn = <Button onClick={() => this.handleAddConfirm(this.props.fetchData, this.props.closeModal)} outline color="danger" style={{ color: 'white', margin: '5px' }}>ยืนยัน</Button>
            SelectPosition = <Select
                styles={{
                    control: styles => ({
                        ...styles,
                        borderColor: this.state.error['posId'] === true ? 'red !important' : ''
                    })
                }} 
                classNamePrefix='selectsearchdtsblackstyle'
                defaultValue={{ label: this.state.Positions, value: this.state.posId }}
                name='Positions'
                placeholder={this.state.Positions}
                options={PositionsArray}
                isSearchable={true}
                onChange={(event) => this.handleDropdownChange(event, 'Positions', 'posId')}
                noOptionsMessage={() => 'ไม่พบข้อมูล'}
            />
            SelectDeparment = <Select
                styles={{
                    control: styles => ({
                        ...styles,
                        borderColor: this.state.error['depId'] === true ? 'red !important' : ''
                    })
                }} 
                classNamePrefix='selectsearchdtsblackstyle'
                defaultValue={{ label: this.state.Departments, value: this.state.depId }}
                placeholder={this.state.Departments}
                options={DepartmentsArray}
                isSearchable={true}
                onChange={(event) => this.handleDropdownChange(event, 'Departments', 'depId')}
                noOptionsMessage={() => 'ไม่พบข้อมูล'}
            />
            SelectDevision = <Select
                styles={{
                    control: styles => ({
                        ...styles,
                        borderColor: this.state.error['divId'] === true ? 'red !important' : ''
                    })
                }} 
                classNamePrefix='selectsearchdtsblackstyle'
                defaultValue={{ label: this.state.Divisions, value: this.state.divId }}
                placeholder={this.state.Divisions}
                options={DivisionsArray}
                isSearchable={true}
                onChange={(event) => this.handleDropdownChange(event, 'Divisions', 'divId')}
                noOptionsMessage={() => 'ไม่พบข้อมูล'}
            />

            SelectSection = <Select
                styles={{
                    control: styles => ({
                        ...styles,
                        borderColor: this.state.error['secId'] === true ? 'red !important' : ''
                    })
                }} 
                classNamePrefix='selectsearchdtsblackstyle'
                defaultValue={{ label: this.state.Sections, value: this.state.secId }}
                placeholder={this.state.Sections}
                options={SectionsArray}
                isSearchable={true}
                onChange={(event) => this.handleDropdownChange(event, 'Sections', 'secId')}
                noOptionsMessage={() => 'ไม่พบข้อมูล'}
            />
            SelectEmployeeHead = <Select
                classNamePrefix='selectsearchdtsblackstyle'
                defaultValue={{ label: this.state.EmployeesHeads, value: this.state.empHeadId }}
                placeholder={this.state.EmployeesHeads}
                options={EmployeesHeadsArray}
                isSearchable={true}
                onChange={(event) => this.handleDropdownChange(event, 'EmployeesHeads', 'empHeadId')}
                noOptionsMessage={() => 'ไม่พบข้อมูล'}
            />
            SelectGroupUser = <Select
                styles={{
                    control: styles => ({
                        ...styles,
                        borderColor: this.state.error['grpUsId'] === true ? 'red !important' : ''
                    })
                }} 
                classNamePrefix='selectsearchdtsblackstyle'
                defaultValue={{ label: this.state.GroupUsers, value: this.state.grpUsId }}
                placeholder={this.state.GroupUsers}
                options={GroupUsersArray}
                isSearchable={true}
                onChange={(event) => this.handleDropdownChange(event, 'GroupUsers', 'grpUsId')}
                noOptionsMessage={() => 'ไม่พบข้อมูล'}
            />
            radioHeadEmp = <Col sm={8}>
                {this.props.ishead ?
                    <FontAwesomeIcon icon={['far', 'dot-circle']} size='lg' style={{ color: "red", cursor: 'pointer' }} onClick={this.props.handleisHeadEmpResult} /> :
                    <FontAwesomeIcon icon={['far', 'circle']} size='lg' style={{ color: "red", cursor: 'pointer' }} onClick={this.props.handleisHeadEmpResult} />
                }

            </Col>
        }
          //console.log('PositionsArray Addedit ' + JSON.stringify(this.props.PositionsArray))
        this.props.PositionsArray ? this.props.PositionsArray.map((item, key) => {
            PositionsArray.push({ key: key, value: item.posId, label: item.posName })
        }) : []

        // console.log('DepartmentsArray Addedit ' + JSON.stringify(this.props.DepartmentsArray))
        this.props.DepartmentsArray ? this.props.DepartmentsArray.map((item, key) => {
            DepartmentsArray.push({ key: key, value: item.depId, label: item.depName })
        }) : []

        //  console.log('DevisionsArray Addedit' + JSON.stringify(this.props.DevisionsArray))
        this.props.DevisionsArray ? this.props.DevisionsArray.map((item, key) => {
            DivisionsArray.push({ key: key, value: item.divId, label: item.divName })
        }) : []

        //   console.log('SectionsArray Addedit ' + JSON.stringify(this.props.SectionsArray))
        this.props.SectionsArray ? this.props.SectionsArray.map((item, key) => {
            SectionsArray.push({ key: key, value: item.secId, label: item.secName })
        }) : []

        //  console.log('EmployeesHeadsArray Addedit ' + JSON.stringify(this.props.EmployeesHeadsArray))
        this.props.EmployeesHeadsArray ? this.props.EmployeesHeadsArray.map((item, key) => {
            EmployeesHeadsArray.push({ key: key, value: item.empHeadId, label: item.empHeadName })
        }) : []

        // console.log('GroupUsersArray Addedit ' + JSON.stringify(this.props.GroupUsersArray))
        this.props.GroupUsersArray ? this.props.GroupUsersArray.map((item, key) => {
            GroupUsersArray.push({ key: key, value: item.grpUsId, label: item.grpUsName })
        }) : []

        return (

            <Modal contentClassName='reviewdocmodal' isOpen={this.props.showModal} toggle={this.props.closeModal}>
                <ModalHeader toggle={this.props.closeModal}> {header}  </ModalHeader>
                <ModalBody>

                    <FormGroup row>
                        <Label for="empCode" sm={4}>รหัสพนักงาน</Label>
                        <Col sm={8}>
                            <Input className={this.state.error['empCode'] ? 'projTextboxInvalid' : 'projTextbox'}
                                onChange={this.handleChange} type="text" value={this.state.empCode} name="empCode" id="empCode" style={{ color: 'grey', backgroundColor: '#21375F', border: '1px solid black', marginBottom: '5px' }} />
                           
                        </Col>
                    </FormGroup>

                    <FormGroup row>
                        <Label for="empName" sm={4}>ชื่อ-นามสกุล</Label>
                        <Col sm={8}>
                            <Input className={this.state.error['empName'] ? 'projTextboxInvalid' : 'projTextbox'}
                                onChange={this.handleChange} type="text" value={this.state.empName} name="empName" id="empName" style={{ color: 'white', backgroundColor: '#21375F', border: '1px solid black', marginBottom: '5px' }} />
                           
                        </Col>
                    </FormGroup>
                    {/*----------------------Position-----------------------------------------------*/}
                    <FormGroup row>
                        <Label for="posName" sm={4}>ตำแหน่ง</Label>
                        <Col sm={8}>
                            {SelectPosition}
                         
                        </Col>
                    </FormGroup>

                    {/*-------------Deparment------------------------------------*/}
                    <FormGroup row>
                        <Label for="depName" sm={4}>ฝ่าย</Label>
                        <Col sm={8}>
                            {SelectDeparment}
                        </Col>
                    </FormGroup>

                    {/*-------------------------Division------------------------*/}
                    <FormGroup row>
                        <Label for="divName" sm={4}>แผนก</Label>
                        <Col sm={8}>
                            {SelectDevision}
                        </Col>
                    </FormGroup>

                    {/*-----------------Sections----------------------------*/}
                    <FormGroup row>
                        <Label for="secName" sm={4}>กลุ่มงาน</Label>
                        <Col sm={8}>
                            {SelectSection}
                        </Col>
                    </FormGroup>

                    <FormGroup row>
                        <Label for="cusEmail" sm={4}>เป็นหัวหน้า</Label>
                       {radioHeadEmp}
                        
                    </FormGroup>

                    {/*--------------------EmployeesHeads------------------*/}
                    <FormGroup row>
                        <Label for="empHeadName" sm={4}>หัวหน้างาน</Label>
                        <Col sm={8}>
                            {SelectEmployeeHead}
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="empInphone" sm={4}>เบอร์ภายใน</Label>
                        <Col sm={8}>
                            <Input className={this.state.error['empInphone'] ? 'projTextboxInvalid' : 'projTextbox'}
                                onChange={this.handleChange} type="number" value={this.state.empInphone} name="empInphone" id="empInphone" style={{ color: 'white', backgroundColor: '#21375F', border: '1px solid black', marginBottom: '5px' }} />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="empMobile" sm={4}>เบอร์มือถือ</Label>
                        <Col sm={8}>
                            <Input className={this.state.error['empMobile'] ? 'projTextboxInvalid' : 'projTextbox'}
                                onChange={this.handleChange} type="number" value={this.state.empMobile} name="empMobile" id="empMobile" style={{ color: 'white', backgroundColor: '#21375F', border: '1px solid black', marginBottom: '5px' }} />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="empEmail" sm={4}>อีเมล์</Label>
                        <Col sm={8}>
                            <Input onChange={this.handleChange} type="text" value={this.state.empEmail} name="empEmail" id="empEmail" style={{ color: 'white', backgroundColor: '#21375F', border: '1px solid black', marginBottom: '5px' }} />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="username" sm={4}>ชื่อเข้าใช้งาน</Label>
                        <Col sm={8}>
                            <Input className={this.state.error['username'] ? 'projTextboxInvalid' : 'projTextbox'}
                                onChange={this.handleChange} type="text" value={this.state.username} name="username" id="username" style={{ color: 'white', backgroundColor: '#21375F', border: '1px solid black', marginBottom: '5px' }} />
                        </Col>
                    </FormGroup>
                    {/*----------------------GroupUsers-----------------------*/}
                    <FormGroup row>
                        <Label for="grpUsName" sm={4}>กลุ่มผู้ใช้งาน</Label>
                        <Col sm={8}>
                            {SelectGroupUser}
                        </Col>
                    </FormGroup>
                    <p style={{ textAlign: "center" }}>
                        {confirmBtn}
                        <Button onClick={this.props.closeModal} outline color="danger" style={{ color: 'white', margin: '5px' }}>ยกเลิก</Button>
                    </p>

                </ModalBody>
            </Modal>


        )
    }


}