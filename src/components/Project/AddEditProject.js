import React, { Component } from 'react'
import { FormGroup, Input, Modal, ModalHeader, ModalBody, Label, InputGroupAddon, InputGroupText, Col, Button, Form, Row, InputGroup } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AuthService from '../AuthService';
import axios from 'axios'
import swal from 'sweetalert'
import Select from 'react-select'
import DtsDatePicker from '../componentsReuse/DtsDatePicker';
import moment from 'moment'

const auth = new AuthService()
const datenow = new Date()

export default class AddEditProject extends Component {
    constructor(props) {
        super(props)

        this.state = {
            error: {},
            projectCode: '',
            projectStatus: '',
            projectStatusId: -1,
            projectName: '',
            projectGroup: '',
            projectGroupId: -1,
            projectShortName: '',
            projectType: '',
            projectTypeId: -1,
            projectWork: '',
            projectWorkId: -1,
            customerName: '',
            customerId: '',
            contactNo: '',
            contactStartDate: datenow,
            contactStopDate: datenow,
            projectDuration: '',
            insuranceStopDate: datenow,
            projectBudget: '',

            contributers: [],   //contributers[{contributerIndex:-1,contributerName:'',contributerId:-1,contributerRoleName:'',contributerRoleId:-1}] 
            totalContributer: 0,
            countributerCounter: 0,
            counter: 0
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleAddConfirm = this.handleAddConfirm.bind(this)
        this.handleEditConfirm = this.handleEditConfirm.bind(this)
        this.handleDropdownChange = this.handleDropdownChange.bind(this)
        this.handleContributerChange = this.handleContributerChange.bind(this)
        this.handleDateChange = this.handleDateChange.bind(this)
        this.addContributer = this.addContributer.bind(this)
        this.deleteContributer = this.deleteContributer.bind(this)
    }

    //*******************************************************************************************************************************************************************************

    async componentDidMount() {
        if (this.props.name === 'edit') {
            const id = this.props.item.projId
            const webapiurl = await axios.get('api/ConfigFromAppSetting')
            const contributerTemp = []
            const counter = this.state.counter
            let totalcontributer = 0

            auth.fetchWithToken(webapiurl.data + '/api/v1/Projects/' + id, "method:'GET'")
                .then(res => {
                    const projectEmployees = res.data.projectEmployees

                    projectEmployees ? projectEmployees.map((item, key) => {
                        contributerTemp.push({
                            contributerIndex: key, contributerName: item.employees.empName,
                            contributerId: item.employees.empId,
                            contributerRoleName: item.role ? item.role.roleName : '',
                            contributerRoleId: item.role ? item.role.roleId : -1,
                        })
                        totalcontributer = totalcontributer + 1
                    }) : []

                    this.setState({
                        projectId: res.data.projId,
                        projectCode: res.data.projCode ? res.data.projCode : '',
                        projectName: res.data.projName ? res.data.projName : '',
                        projectShortName: res.data.projShortName ? res.data.projShortName : '',
                        projectStatus: res.data.projectStatus ? res.data.projectStatus.projStatusName : '',
                        projectStatusId: res.data.projectStatus ? res.data.projectStatus.projStatusId : '',
                        projectGroup: res.data.projectGroup ? res.data.projectGroup.projGroupName : '',
                        projectGroupId: res.data.projectGroup ? res.data.projectGroup.projGroupId : '',
                        projectType: res.data.projectType ? res.data.projectType.projTypeName : '',
                        projectTypeId: res.data.projectType ? res.data.projectType.projTypeId : '',
                        projectWork: res.data.projectWork ? res.data.projectWork.projWorkName : '',
                        projectWorkId: res.data.projectWork ? res.data.projectWork.projWorkId : '',
                        customerName: res.data.customer ? res.data.customer.cusName : '',
                        customerId: res.data.customer ? res.data.customer.cusId : '',
                        contactNo: res.data.contractNo ? res.data.contractNo : '',
                        contactStartDate: res.data.contractStart ? new Date(res.data.contractStart) : datenow,
                        contactStopDate: res.data.contractEnd ? new Date(res.data.contractEnd) : datenow,
                        projectDuration: res.data.projDurarion ? res.data.projDurarion : '',
                        insuranceStopDate: res.data.contractGuarante ? new Date(res.data.contractGuarante) : datenow,
                        projectBudget: res.data.projBudget ? res.data.projBudget : '',
                        contributers: contributerTemp,
                        projFag: res.data.projFag ? res.data.projFag : null,
                        totalContributer: totalcontributer,
                        counter: counter + 1
                    })
                })
                .catch(error => console.log(error));
        }
    }

    //*******************************************************************************************************************************************************************************

    addContributer() {
        const currentContributer = this.state.totalContributer
        const totalContributer = parseInt(currentContributer) + 1
        const contributers = this.state.contributers
        const contributercounter = this.state.contributers.length ? this.state.contributers.length : 0

        //if (contributers.filter(x => x.contributerName == '').length > 0) {
        //    swal({ text: 'กรุณาใส่ชื่อผู้เข้าร่วมโครงการให้ครบ', icon: 'warning' })
        //    return
        //}
        

        contributers.push({ contributerIndex: contributercounter + 1, contributerName: '', contributerId: -1, contributerRoleName: '', contributerRoleId: -1 })

        this.setState({ totalContributer: totalContributer, contributers: contributers, countributerCounter: contributercounter + 1 })
    }

    //*******************************************************************************************************************************************************************************

    deleteContributer(contributerIndex) {
        const currentContributer = this.state.totalContributer
        const totalContributer = parseInt(currentContributer) - 1
        let contributerArray = this.state.contributers
        
        var indexToRemove = contributerArray.map(x => { return x.contributerIndex }).indexOf(contributerIndex);

        contributerArray.splice(indexToRemove, 1)

        this.setState({ contributers: contributerArray, totalContributer: totalContributer })
    }

    //*******************************************************************************************************************************************************************************

    handleContributerChange(e, name, nameId, contributerCounter) {
        let value = e.value // id
        let label = e.label // name

        //const contributerTemp = this.state.contributers

        //for (let i = 0; i < contributerTemp.length; i++) {
        //    if (contributerTemp[i].contributerName == label) {
        //        swal({ text: 'ชื่อผู้เข้าร่วมโครงการซ้ำ', icon: 'warning' })
        //        this.setState(prevState => ({
        //            contributers: prevState.contributers.map(el => el.contributerIndex === contributerCounter ? { contributerIndex: contributerCounter, contributerName: '', contributerId: -1, contributerRoleName: '', contributerRoleId: -1 } : el)
        //        }))
        //        return
        //    }
        //}

        this.setState(prevState => ({
            contributers: prevState.contributers.map(el => el.contributerIndex === contributerCounter ? { ...el, contributerIndex: contributerCounter, [nameId]: value, [name]: label } : el)
        }))
    }

    //*******************************************************************************************************************************************************************************

    handleDropdownChange(e, name, nameId) {
        let value = e.value
        let label = e.label

        this.setState({
            [name]: label,
            [nameId]: value
        })
    }

    //*******************************************************************************************************************************************************************************

    async handleAddConfirm(fetch, close) {
        const role = auth.getProfile().role
        if (role.toLowerCase() === 'lead') {
            swal({ text: 'คุณสามารถ แก้ไขรายชื่อผู้เข้าร่วมโครงการได้อย่างเดียว', icon: 'warning' })
            return
        }
        const newErrors = { }
        const projectCode = this.state.projectCode
        const projectName = this.state.projectName
        const projectShortName = this.state.projectShortName
        const projectType = this.state.projectType
        const projectStatus = this.state.projectStatus
        const projectGroup = this.state.projectGroup
        const projectWork = this.state.projectWork
        const profile = auth.getProfile()
        const empid = profile.nameid
        const webapiurl = await axios.get('api/ConfigFromAppSetting')
        const contributerArray = this.state.contributers   //contributers[{contributerIndex:-1,contributerName:'',contributerId:-1,contributerRoleName:'',contributerRoleId:-1}] 
        const totalContributer = this.state.totalContributer
        var projEmp = [] //  ProjectEmployees: [{ EmpId:1 , RoleId:2 },{EmpId:2,RoleId:3}]
        let isError = false

        if (!isError) {
            if (!projectCode || !projectCode.replace(/\s/g, '').length) {
                newErrors["projectCode"] = true
                isError = true
            }
            if (!projectName || !projectName.replace(/\s/g, '').length) {
                newErrors["projectName"] = true
                isError = true
            }
            //if (!projectShortName || !projectShortName.replace(/\s/g, '').length) {
            //    newErrors["projectShortName"] = true
            //    isError = true
            //}
            if (!projectStatus || !projectStatus.replace(/\s/g, '').length) {
                newErrors["projectStatus"] = true
                isError = true
            }
            if (!projectType || !projectType.replace(/\s/g, '').length) {
                newErrors["projectType"] = true
                isError = true
            }
            if (!projectGroup || !projectGroup.replace(/\s/g, '').length) {
                newErrors["projectGroup"] = true
                isError = true
            }
            if (!projectWork || !projectWork.replace(/\s/g, '').length) {
                newErrors["projectWork"] = true
                isError = true
            }
        }

        if (isError) {
            this.setState({ error: newErrors })
            swal({ text: 'กรุณากรอกข้อมูลให้ครบถ้วน', icon: 'warning' })
            return
        }

        if (moment(this.state.contactStartDate) > moment(this.state.contactStopDate)) {
            newErrors["contactStartDate"] = true
            newErrors["contactStopDate"] = true
            this.setState({ error: newErrors })
            swal({ text: 'วันเริ่มต้นต้องน้อยกว่าวันสิ้นสุด', icon: 'warning' })
            return
        }

        
       
        if (totalContributer > 0) {
            let contributerIdTempArray = []

            for (let i = 0; i < totalContributer; i++) {
                let tempObj = {}
                const empid = contributerArray[i].contributerId
                const roleid = contributerArray[i].contributerRoleId
                if (empid === -1) {        //(empid === -1 || roleid === -1)
                    newErrors["contributers"] = true
                    this.setState({ error: newErrors })
                    swal({ text: 'กรุณากรอกชื่อผู้ร่วมโครงการให้ครบ', icon: 'warning' })
                    return
                }

                tempObj = ({ ProjId: -1, EmpId: empid, RoleId: roleid })
                contributerIdTempArray.push(empid)
                projEmp.push(tempObj)
            }
            const uniqueConributer = new Set(contributerIdTempArray)        //เช็คผู้เข้าร่วมโครงการซ้ำ
            if (contributerArray.length != uniqueConributer.size) {
                newErrors["contributers"] = true
                this.setState({ error: newErrors })
                swal({ text: 'รายชื่อผู้เข้าร่วมโครงการซ้ำ', icon: 'warning' })
                return
            }
        }

        

        const jsondata = JSON.stringify({
            ProjCode: this.state.projectCode,
            ProjName: this.state.projectName,
            ProjShortName: this.state.projectShortName,
            CusId: this.state.customerId,
            ProjTypeId: this.state.projectTypeId,
            ProjWorkId: this.state.projectWorkId,
            ProjStatusId: this.state.projectStatusId,
            ProjectGroupId: this.state.projectGroupId,
            ContractNo: this.state.contactNo,
            ContractStart: this.state.contactStartDate,
            ContractEnd: this.state.contactStopDate,
            ProjDurarion: this.state.projectDuration,
            ContractGuarante: this.state.insuranceStopDate,
            ProjBudget: this.state.projectBudget,
            StampDate: new Date(),
            ModifyDate: new Date(),
            ModifyEmpId: empid,
            ProjFag: 0,
            ProjectEmployees: projEmp,
        })

        swal({
            title: 'ท่านต้องการเพิ่มข้อมูลโครงการ ใช่หรือไม่',
            text: this.state.projectCode + ': ' + this.state.projectName,
            buttons: {
                ok: 'ตกลง',
                cancel: 'ยกเลิก'
            }
        }).then((value) => {

            switch (value) {
                case 'ok':
                    auth.fetchWithToken(webapiurl.data + '/api/v1/Projects', { method: 'POST', data: jsondata })
                        .then(response => {
                            if (auth._IsSuccessResponse(response)) {
                                this.setState({ error: newErrors })
                                swal({ text: 'เพิ่มข้อมูลสำเร็จ', icon: 'success' })
                                fetch()
                                close()
                            }
                        }).catch(error => {
                            console.log('error:' + error)
                            
                            if (error.response && error.response.data && error.response.data.message) {
                                newErrors["projectCode"] = true
                                this.setState({ error: newErrors })
                                swal({ text: error.response.data.message, icon: 'warning' })
                            }
                            else {
                                this.setState({ error: {} })
                                swal({ text: 'ไม่สามารถเพิ่มข้อมูลได้', icon: 'warning' })
                            }
                        })
                    break;

            }
        })

        
    }

    //*******************************************************************************************************************************************************************************

    async handleEditConfirm(fetch, close) {
        const newErrors = { }
        const projectCode = this.state.projectCode
        const projectName = this.state.projectName
        const projectShortName = this.state.projectShortName
        const projectType = this.state.projectType
        const projectStatus = this.state.projectStatus
        const projectGroup = this.state.projectGroup
        const projectWork = this.state.projectWork
        const profile = auth.getProfile()
        const empid = profile.nameid
        const webapiurl = await axios.get('api/ConfigFromAppSetting')
        const contributerArray = this.state.contributers   //contributers[{contributerIndex:-1,contributerName:'',contributerId:-1,contributerRoleName:'',contributerRoleId:-1}] 
        const totalContributer = this.state.totalContributer
        var projEmp = [] //  ProjectEmployees: [{ EmpId:1 , RoleId:2 },{EmpId:2,RoleId:3}]
        let isError = false

        if (!isError) {
            if (!projectCode || !projectCode.replace(/\s/g, '').length) {
                newErrors["projectCode"] = true
                isError = true
            }
            if (!projectName || !projectName.replace(/\s/g, '').length) {
                newErrors["projectName"] = true
                isError = true
            }
            //if (!projectShortName || !projectShortName.replace(/\s/g, '').length) {
            //    newErrors["projectShortName"] = true
            //    isError = true
            //}
            if (!projectStatus || !projectStatus.replace(/\s/g, '').length) {
                newErrors["projectStatus"] = true
                isError = true
            }
            if (!projectType || !projectType.replace(/\s/g, '').length) {
                newErrors["projectType"] = true
                isError = true
            }
            if (!projectGroup || !projectGroup.replace(/\s/g, '').length) {
                newErrors["projectGroup"] = true
                isError = true
            }
            if (!projectWork || !projectWork.replace(/\s/g, '').length) {
                newErrors["projectWork"] = true
                isError = true
            }
        }

        if (isError) {
            this.setState({ error: newErrors })
            swal({ text: 'กรุณากรอกข้อมูลให้ครบถ้วน', icon: 'warning' })
            return
        }

        if (moment(this.state.contactStartDate) > moment(this.state.contactStopDate)) {
            newErrors["contactStartDate"] = true
            newErrors["contactStopDate"] = true
            this.setState({ error: newErrors })
            swal({ text: 'วันเริ่มต้นต้องน้อยกว่าวันสิ้นสุด', icon: 'warning' })
            return
        }

        if (totalContributer > 0) {
            let contributerIdTempArray = []
            for (let i = 0; i < totalContributer; i++) {
                let tempObj = {}
                const empid = contributerArray[i].contributerId
                const roleid = contributerArray[i].contributerRoleId
                if (empid === -1) {    //(empid === -1 || roleid === -1)
                    newErrors["contributers"] = true
                    this.setState({ error: newErrors })
                    swal({ text: 'กรุณากรอกชื่อผู้ร่วมโครงการให้ครบ', icon: 'warning' })
                    return
                }

                tempObj = ({ ProjId: this.state.projectId, EmpId: empid, RoleId: roleid })
                contributerIdTempArray.push(empid)
                projEmp.push(tempObj)
            }
            const uniqueConributer = new Set(contributerIdTempArray)        //เช็คผู้เข้าร่วมโครงการซ้ำ
            if (contributerArray.length != uniqueConributer.size) {
                newErrors["contributers"] = true
                this.setState({ error: newErrors })
                swal({ text: 'รายชื่อผู้เข้าร่วมโครงการซ้ำ', icon: 'warning' })
                return
            }
        }

        const jsondata = JSON.stringify({
            ProjId: this.state.projectId,
            ProjCode: this.state.projectCode,
            ProjName: this.state.projectName,
            ProjShortName: this.state.projectShortName,
            CusId: this.state.customerId,
            ProjTypeId: this.state.projectTypeId,
            ProjWorkId: this.state.projectWorkId,
            ProjStatusId: this.state.projectStatusId,
            ProjectGroupId: this.state.projectGroupId,
            ContractNo: this.state.contactNo,
            ContractStart: this.state.contactStartDate,
            ContractEnd: this.state.contactStopDate,
            ProjDurarion: this.state.projectDuration,
            ContractGuarante: this.state.insuranceStopDate,
            ProjBudget: this.state.projectBudget,
            StampDate: new Date(),
            ModifyDate: new Date(),
            ModifyEmpId: empid,
            projFag: this.state.projFag,
            ProjectEmployees: projEmp,
        })

        const id = this.props.item.projId

        swal({
            title: 'ท่านต้องการแก้ไขข้อมูลโครงการ ใช่หรือไม่',
            text: this.state.projectCode + ': ' + this.state.projectName,
            buttons: {
                ok: 'ตกลง',
                cancel: 'ยกเลิก'
            }
        }).then((value) => {

            switch (value) {
                case 'ok':
                    auth.fetchWithToken(webapiurl.data + '/api/v1/Projects/' + id, { method: 'PUT', data: jsondata })
                        .then(response => {
                            if (auth._IsSuccessResponse(response)) {
                                this.setState({ error: newErrors })
                                swal({ text: 'แก้ไขข้อมูลสำเร็จ', icon: 'success' })
                                fetch()
                                close()
                            }
                        }).catch(error => {
                            console.log('error:' + error)

                            if (error.response && error.response.data && error.response.data.message) {
                                newErrors["projectCode"] = true
                                this.setState({ error: newErrors })
                                swal({ text: error.response.data.message, icon: 'warning' })
                            }
                            else {
                                this.setState({ error: {} })
                                swal({ text: 'ไม่สามารถเพิ่มข้อมูลได้', icon: 'warning' })
                            }
                        })
                    break;
            }
        })


       
    }

    //*******************************************************************************************************************************************************************************

    handleChange(e) {
        const role = auth.getProfile().role
        if (role.toLowerCase() === 'lead') {
            swal({ text: 'คุณสามารถ แก้ไขรายชื่อผู้เข้าร่วมโครงการได้อย่างเดียว', icon: 'warning' })
            return
        }
        const name = e.target.name
        const val = e.target.value

        if (name === 'projectDuration' || name === 'projectBudget') {
            const re = /^[0-9]*$/;
            if (!re.test(e.target.value)) {
                e.preventDefault()
                return
            }
        }

        this.setState({
            [name]: val
        })

    }

    handleDateChange(name, val) {
        const role = auth.getProfile().role
        if (role.toLowerCase() === 'lead') {
            swal({ text: 'คุณสามารถ แก้ไขรายชื่อผู้เข้าร่วมโครงการได้อย่างเดียว', icon: 'warning' })
            return
        }
        this.setState({ [name]: val })
    }
    //*******************************************************************************************************************************************************************************


    render() {
        const role = auth.getProfile().role
        let header = ''
        let confirmBtn = ''
        let projectStatusArray = []
        let projectTypeArray = []
        let projectWorkArray = []
        let projectGroupArray = []
        let customerArray = []
        let roleArray = []
        let employeeArray = []
        let contributerArray = []
        let totalContributer = this.state.totalContributer

        if (this.props.name === 'add') {
            header = <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                <FontAwesomeIcon icon={['fas', 'plus']} style={{ color: '#39B54A', margin: '5px', }} size='1x' /> <span style={{ fontSize: '16px' }}>เพิ่มข้อมูลโครงการ</span>
            </div>
            confirmBtn = <Button onClick={() => this.handleAddConfirm(this.props.fetchData, this.props.closeModal)} outline color="danger" style={{ color: 'white', margin: '5px' }}>ยืนยัน</Button>
        }
        else {
            header = <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                <FontAwesomeIcon icon={['fas', 'edit']} style={{ color: '#39B54A', margin: '5px', }} size='1x' /> <span style={{ fontSize: '16px' }}>แก้ไขข้อมูลโครงการ</span>
            </div>
            confirmBtn = <Button onClick={() => this.handleEditConfirm(this.props.fetchData, this.props.closeModal)} outline color="danger" style={{ color: 'white', margin: '5px' }}>แก้ไข</Button>
        }
        
        this.props.projectStatusArray ? this.props.projectStatusArray.map((item, key) => {
            projectStatusArray.push({ key: key, value: item.projStatusId, label: item.projStatusName })
        }) : []

        this.props.projectTypeArray ? this.props.projectTypeArray.map((item, key) => {
            projectTypeArray.push({ key: key, value: item.projTypeId, label: item.projTypeName })
        }) : []

        this.props.projectWorkArray ? this.props.projectWorkArray.map((item, key) => {
            projectWorkArray.push({ key: key, value: item.projWorkId, label: item.projWorkName })
        }) : []

        this.props.customerArray ? this.props.customerArray.map((item, key) => {
            customerArray.push({ key: key, value: item.cusId, label: item.cusName })
        }) : []

        this.props.roleArray ? this.props.roleArray.map((item, key) => {
            roleArray.push({ key: key, value: item.roleId, label: item.roleName })
        }) : []

        this.props.employeeArray ? this.props.employeeArray.map((item, key) => {
            employeeArray.push({ key: key, value: item.empId, label: item.empName })
        }) : []

        this.props.projectGroupArray ? this.props.projectGroupArray.map((item, key) => {
            projectGroupArray.push({ key: key, value: item.projGroupId, label: item.projGroupName })
        }) : []

        
        if (this.state.contributers && totalContributer > 0) {
            for (let i = 0; i < totalContributer; i++) {
                const num = i + 1
                let showMinus = false

                for (let j = 0; j < employeeArray.length; j++) {
                    if (this.state.contributers[i].contributerId == employeeArray[j].value) {
                        showMinus = true
                        continue
                    }
                }
                
                contributerArray.push(
                    <Row key={i} style={{ marginBottom: '10px', justifyContent: 'center' }}>
                        <Col lg={1} md={1} sm={1} xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                            {num}
                        </Col>
                        <Col lg={4} md={4} sm={4} xs={12} style={{ margin: '3px' }}>
                            <Select
                                style={{ color: 'white' }}
                                //value={this.state.contributers[i].contributerName}
                                key={this.state.contributers[i].contributerId}
                                classNamePrefix='selectsearchdtsblackstyle'
                                placeholder={this.state.contributers[i].contributerName}
                                defaultValue={{ label: this.state.contributers[i].contributerName, value: this.state.contributers[i].contributerId }}
                                options={employeeArray}
                                isSearchable={true}
                                isDisabled={showMinus == false && this.props.name == 'edit' && this.state.contributers[i].contributerName != '' ? true : false}
                                onChange={(event) => this.handleContributerChange(event, 'contributerName', 'contributerId', this.state.contributers[i].contributerIndex)}
                                noOptionsMessage={() => 'ไม่พบข้อมูล'}
                                menuPlacement='auto'
                            />
                        </Col>

                        <Col lg={4} md={4} sm={4} xs={12} style={{ margin: '3px' }}>
                            <Select
                                key={this.state.contributers[i].contributerId}
                                classNamePrefix='selectsearchdtsblackstyle'
                                defaultValue={{ label: this.state.contributers[i].contributerRoleName, value: this.state.contributers[i].contributerRoleId }}
                                placeholder={this.state.contributers[i].contributerRoleName}
                                options={roleArray}
                                isSearchable={true}
                                isDisabled={showMinus == false && this.props.name == 'edit' && this.state.contributers[i].contributerName != '' ? true : false}
                                //isDisabled={showMinus == true ? false : true}
                                onChange={(event) => this.handleContributerChange(event, 'contributerRoleName', 'contributerRoleId', this.state.contributers[i].contributerIndex)}
                                noOptionsMessage={() => 'ไม่พบข้อมูล'}
                                menuPlacement='auto'
                            />
                        </Col>

                        <Col lg={1} md={1} sm={1} xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                            {showMinus == true || this.state.contributers[i].contributerName == '' ?
                                <FontAwesomeIcon
                                    onClick={() => this.deleteContributer(this.state.contributers[i].contributerIndex)}
                                    icon={['far', 'minus-square']}
                                    style={{ color: 'red', cursor: 'pointer' }}
                                    size='2x' />

                            : ''}
                            
                        </Col>
                    </Row>
                )
            }

        }

        return (

            <Modal size='lg' contentClassName='reviewdocmodal' isOpen={this.props.showModal} toggle={this.props.closeModal}>
                <ModalHeader toggle={this.props.closeModal}> {header}  </ModalHeader>
                <ModalBody>
                    <Form>

                        {/**********PROJECT CODE ห้ามว่าง*************/}

                        <Row>
                            <Col lg={6} md={6}>
                                <FormGroup row>
                                    <Label for="roleid" sm={5}>รหัสโครงการ</Label>
                                    <Col sm={7}>
                                        <Input
                                            maxLength={10}
                                            type="text"
                                            className={this.state.error['projectCode'] ? 'projTextboxInvalid' : 'projTextbox'}
                                            autoComplete='off'
                                            onChange={this.handleChange}
                                            type="text"
                                            value={this.state.projectCode}
                                            name="projectCode"
                                        />
                                    </Col>
                                </FormGroup>
                            </Col>

                            {/**********PROJECT STATUS ห้ามว่าง*************/}

                            <Col lg={6} md={6}>
                                <FormGroup row>
                                    <Label for="roleid" sm={5}>สถานะโครงการ</Label>
                                    <Col sm={7}>
                                        <Select

                                            styles={{
                                                control: styles => ({
                                                    ...styles,
                                                    borderColor: this.state.error['projectStatus'] === true ? 'red !important' : ''
                                                })
                                            }}
                                            key={this.state.counter}
                                            classNamePrefix='selectsearchdtsblackstyle'
                                            defaultValue={{ label: this.state.projectStatus, value: this.state.projectStatusId }}
                                            options={projectStatusArray}
                                            isSearchable={true}
                                            openMenuOnClick={role.toLowerCase() === 'lead' ? false : true}
                                            onChange={(event) => this.handleDropdownChange(event, 'projectStatus', 'projectStatusId')}
                                            noOptionsMessage={() => 'ไม่พบข้อมูล'}
                                        />
                                    </Col>
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row>

                            {/**********PROJECT NAME ห้ามว่าง *************/}

                            <Col lg={6} md={6}>
                                <FormGroup row>
                                    <Label sm={5}>ชื่อโครงการ</Label>
                                    <Col sm={7}>
                                        <Input
                                            type="text"
                                            className={this.state.error['projectName'] ? 'projTextboxInvalid' : 'projTextbox'}
                                            autoComplete='off'
                                            onChange={this.handleChange}
                                            type="text"
                                            value={this.state.projectName}
                                            name="projectName"
                                        />
                                    </Col>
                                </FormGroup>
                            </Col>

                            {/**********PROJECT GROUP ห้ามว่าง *************/}

                            <Col lg={6} md={6}>
                                <FormGroup row>
                                    <Label sm={5}>กลุ่มงาน</Label>
                                    <Col sm={7}>
                                        <Select
                                            styles={{
                                                control: styles => ({
                                                    ...styles,
                                                    borderColor: this.state.error['projectGroup'] === true ? 'red !important' : ''
                                                })
                                            }}
                                            key={this.state.counter}
                                            classNamePrefix='selectsearchdtsblackstyle'
                                            defaultValue={{ label: this.state.projectGroup, value: this.state.projectGroupId }}
                                            placeholder={this.state.projectGroup}
                                            options={projectGroupArray}
                                            isSearchable={true}
                                            openMenuOnClick={role.toLowerCase() === 'lead' ? false : true}
                                            onChange={(event) => this.handleDropdownChange(event, 'projectGroup', 'projectGroupId')}
                                            noOptionsMessage={() => 'ไม่พบข้อมูล'}
                                        />
                                    </Col>
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row>

                            {/**********PROJECT SHORT NAME ห้ามว่าง *************/}

                            <Col lg={6} md={6}>
                                <FormGroup row>
                                    <Label sm={5}>ชื่อย่อโครงการ</Label>
                                    <Col sm={7}>
                                        <Input
                                            type="text"
                                            className={this.state.error['projectShortName'] ? 'projTextboxInvalid' : 'projTextbox'}
                                            autoComplete='off'
                                            onChange={this.handleChange}
                                            type="text"
                                            value={this.state.projectShortName}
                                            name="projectShortName"
                                        />
                                    </Col>
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row>

                            {/**********PROJECT TYPE ห้ามว่าง *************/}

                            <Col lg={6} md={6}>
                                <FormGroup row>
                                    <Label sm={5}>ประเภทโครงการ</Label>
                                    <Col sm={7}>
                                        <Select
                                            styles={{
                                                control: styles => ({
                                                    ...styles,
                                                    borderColor: this.state.error['projectType'] === true ? 'red !important' : ''
                                                })
                                            }}
                                            key={this.state.counter}
                                            classNamePrefix='selectsearchdtsblackstyle'
                                            defaultValue={{ label: this.state.projectType, value: this.state.projectTypeId }}
                                            placeholder={this.state.projectType}
                                            options={projectTypeArray}
                                            isSearchable={true}
                                            openMenuOnClick={role.toLowerCase() === 'lead' ? false : true}
                                            onChange={(event) => this.handleDropdownChange(event, 'projectType', 'projectTypeId')}
                                            noOptionsMessage={() => 'ไม่พบข้อมูล'}
                                        />
                                    </Col>
                                </FormGroup>
                            </Col>

                            {/**********PROJECT WORK ห้ามว่าง*************/}

                            <Col lg={6} md={6}>
                                <FormGroup row>
                                    <Label sm={5}>ประเภทงาน</Label>
                                    <Col sm={7}>
                                        <Select
                                            styles={{
                                                control: styles => ({
                                                    ...styles,
                                                    borderColor: this.state.error['projectWork'] === true ? 'red !important' : ''
                                                })
                                            }}
                                            key={this.state.counter}
                                            classNamePrefix='selectsearchdtsblackstyle'
                                            defaultValue={{ label: this.state.projectWork, value: this.state.projectWorkId }}
                                            placeholder={this.state.projectWork}
                                            options={projectWorkArray}
                                            isSearchable={true}
                                            openMenuOnClick={role.toLowerCase() === 'lead' ? false : true}
                                            onChange={(event) => this.handleDropdownChange(event, 'projectWork', 'projectWorkId')}
                                            noOptionsMessage={() => 'ไม่พบข้อมูล'}
                                        />
                                    </Col>
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row>

                            {/**********CUSTOMER*************/}

                            <Col lg={6} md={6}>
                                <FormGroup row>
                                    <Label sm={5}>ชื่อลูกค้า</Label>
                                    <Col sm={7}>
                                        <Select
                                            key={this.state.counter}
                                            classNamePrefix='selectsearchdtsblackstyle'
                                            defaultValue={{ label: this.state.customerName, value: this.state.customerId }}
                                            placeholder={this.state.customerName}
                                            options={customerArray}
                                            isSearchable={true}
                                            openMenuOnClick={role.toLowerCase() === 'lead' ? false : true}
                                            onChange={(event) => this.handleDropdownChange(event, 'customerName', 'customerId')}
                                            noOptionsMessage={() => 'ไม่พบข้อมูล'}
                                        />
                                    </Col>
                                </FormGroup>
                            </Col>

                            {/**********CONTACT NUMBER*************/}

                            <Col lg={6} md={6}>
                                <FormGroup row>
                                    <Label sm={5}>เลขที่สัญญา</Label>
                                    <Col sm={7}>
                                        <Input
                                            type="text"
                                            className='projTextbox'
                                            autoComplete='off'
                                            onChange={this.handleChange}
                                            type="text"
                                            value={this.state.contactNo}
                                            name="contactNo"
                                        />
                                    </Col>
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row>

                            {/**********CONTACT START DATE*************/}

                            <Col lg={6} md={6}>
                                <FormGroup row>
                                    <Label sm={5}>วันที่เริ่มต้นสัญญา</Label>
                                    <Col sm={7}>
                                        <DtsDatePicker
                                            invalidDate={this.state.error['contactStartDate'] === true ? true : false}
                                            startDate={this.state.contactStartDate}
                                            name='contactStartDate'
                                            handleChange={this.handleDateChange}
                                            allDateAvailable={true}
                                        />
                                    </Col>
                                </FormGroup>
                            </Col>

                            {/**********CONTACT STOP DATE*************/}

                            <Col lg={6} md={6}>
                                <FormGroup row>
                                    <Label sm={5}>วันที่สิ้นสุดสัญญา</Label>
                                    <Col sm={7}>
                                        <DtsDatePicker
                                            invalidDate={this.state.error['contactStopDate'] === true ? true : false}
                                            startDate={this.state.contactStopDate}
                                            name='contactStopDate'
                                            handleChange={this.handleDateChange}
                                            allDateAvailable={true}
                                        />
                                    </Col>
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row>

                            {/**********PROJECT DURATION*************/}

                            <Col lg={6} md={6}>
                                <FormGroup row>
                                    <Label sm={5}>ระยะเวลาโครงการ</Label>
                                    <Col sm={7}>
                                        <InputGroup>
                                            <Input
                                                type="text"
                                                className='projTextbox'
                                                autoComplete='off'
                                                onChange={this.handleChange}
                                                value={this.state.projectDuration}
                                                name="projectDuration"
                                            />
                                            <InputGroupAddon addonType="append">
                                                <InputGroupText style={{ backgroundColor: 'transparent', border: 'none', color: 'white' }}>วัน &nbsp;</InputGroupText>
                                            </InputGroupAddon>
                                        </InputGroup>
                                    </Col>
                                </FormGroup>
                            </Col>

                            {/**********INSURANCE STOP DATE*************/}

                            <Col lg={6} md={6}>
                                <FormGroup row>
                                    <Label sm={5}>วันที่สิ้นสุดประกัน</Label>
                                    <Col sm={7}>
                                        <DtsDatePicker
                                            startDate={this.state.insuranceStopDate}
                                            name='insuranceStopDate'
                                            handleChange={this.handleDateChange}
                                            allDateAvailable={true}
                                        />
                                    </Col>
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row>

                            {/**********PROJECT BUDGET*************/}

                            <Col lg={6} md={6} sm={6}>
                                <FormGroup row>
                                    <Label sm={5}>งบประมาณโครงการ</Label>
                                    <Col sm={7}>
                                        <InputGroup>
                                            <Input
                                                className='projTextbox'
                                                autoComplete='off'
                                                onChange={this.handleChange}
                                                type="text"
                                                value={this.state.projectBudget}
                                                name="projectBudget"
                                            />
                                            <InputGroupAddon addonType="append">
                                                <InputGroupText style={{ backgroundColor: 'transparent', border: 'none', color: 'white' }}>บาท</InputGroupText>
                                            </InputGroupAddon>
                                        </InputGroup>


                                    </Col>
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row>

                            {/********PROJECT CONTRIBUTER***********/}

                            <Col lg={12} md={12}>
                                <FormGroup row>
                                    <Col sm={12}>
                                        <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'left' }}>
                                            <Label style={{ marginBottom: '0px', color: this.state.error['contributers'] === true ? 'red' : 'white' }}>รายชื่อผู้เข้าร่วมโครงการ</Label>
                                            <FontAwesomeIcon
                                                onClick={this.addContributer}
                                                icon={['fas', 'plus']}
                                                style={{ color: '#39B54A', margin: '5px', cursor: 'pointer' }}
                                                size='2x' />
                                        </div>
                                    </Col>
                                </FormGroup>
                            </Col>
                        </Row>

                        <div key={this.state.counter}>
                            {contributerArray}
                        </div>


                        {/*<Row style={{ marginBottom: '10px', justifyContent:'center' }}>
                            <Col lg={4} md={4}>
                                <Select
                                    classNamePrefix='selectsearchdtsblackstyle'
                                    defaultValue={{ label: this.state.contributerName, value: this.state.contributerId }}
                                    placeholder={this.state.contributerName}
                                    options={employeeArray}
                                    isSearchable={true}
                                    onChange={(event) => this.handleDropdownChange(event, 'contributerName', 'contributerId')}
                                    noOptionsMessage={() => 'ไม่พบข้อมูล'}
                                    menuPlacement='auto'
                                />
                            </Col>

                            <Col lg={4} md={4}>
                                <Select
                                    classNamePrefix='selectsearchdtsblackstyle'
                                    defaultValue={{ label: this.state.contributerRoleName, value: this.state.contributerRoleId }}
                                    placeholder={this.state.contributerRoleName}
                                    options={roleArray}
                                    isSearchable={true}
                                    onChange={(event) => this.handleDropdownChange(event, 'contributerRoleName', 'contributerRoleId')}
                                    noOptionsMessage={() => 'ไม่พบข้อมูล'}
                                    menuPlacement='auto'
                                />
                            </Col>

                            <Col lg={1} md={1}>
                                <FontAwesomeIcon
                                    icon={['far', 'minus-square']}
                                    style={{ color: 'red', cursor: 'pointer' }}
                                    size='2x' />
                            </Col>
                        </Row>*/}

                    </Form>


                    <p style={{ textAlign: "center" }}>
                        {confirmBtn}
                        <Button onClick={this.props.handleAddEditProject} outline color="danger" style={{ color: 'white', margin: '5px' }}>ยกเลิก</Button>
                    </p>

                </ModalBody>
            </Modal>
        )
    }
}