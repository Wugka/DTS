import React, { Component } from 'react'
import { ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AuthService from '../AuthService';
import axios from 'axios'
var auth = new AuthService()
export default class DetailModal extends Component {
    constructor() {
        super()
        this.state = { EmployeesHeadsArray: [], ishead: false}      
    }
    async componentDidMount() {
       // console.log('empid ' + this.props.item.empId)
        const webapiurl = await axios.get('api/ConfigFromAppSetting')
        Promise.all([
            auth.fetchWithToken(webapiurl.data + '/api/v1/EmployeesHeads/' + this.props.item.empId, "method:'GET'"),
        ])
            .then(([EmployeesHeads]) => this.setState({
                EmployeesHeadsArray: EmployeesHeads.data,
            }, () => this.state.EmployeesHeadsArray === "" ? this.setState({ ishead: false })  : this.setState({ ishead: true }))
            )
            .catch(error => console.log(error));

        //console.log('EmployeesHeadsArray ' + JSON.stringify(this.state.EmployeesHeadsArray))
    }
    render() {
       
        let header = <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
            <FontAwesomeIcon icon={['fas', 'plus']} style={{ color: '#39B54A', margin: '5px', }} size='1x' /> <span style={{ fontSize: '16px' }}> รายละเอียดข้อมูลพนักงาน</span>
        </div>
        return (
            <span>
                
                <ModalHeader toggle={this.props.click}> {header}  </ModalHeader>
                <ModalBody style={{ overflowWrap: 'break-word' }}>
                    <p style={{ whiteSpace: 'pre-line' }}> รหัสพนักงาน : {this.props.item.empCode}</p>
                    <p style={{ whiteSpace: 'pre-line' }}> ชื่อ-นามสกุล : {this.props.item.empName}</p>
                    <p style={{ whiteSpace: 'pre-line' }}> ตำแหน่ง : {this.props.item.missionEmployees.position.posName}</p>
                    <p style={{ whiteSpace: 'pre-line' }}> ฝ่าย : {this.props.item.missionEmployees.department.depName}</p>
                    <p style={{ whiteSpace: 'pre-line' }}> แผนก : {this.props.item.missionEmployees.devision.divName}</p>
                    <p style={{ whiteSpace: 'pre-line' }}> กลุ่มงาน : {this.props.item.missionEmployees.section.secName}</p>
                    <p style={{ whiteSpace: 'pre-line' }}> เป็นหัวหน้า : {this.state.ishead ?
                        <FontAwesomeIcon icon={['far', 'dot-circle']} size='lg' style={{ color: "red", cursor: 'pointer' }} /> :
                        <FontAwesomeIcon icon={['far', 'circle']} size='lg' style={{ color: "red", cursor: 'pointer' }} />
                    } </p>
                    <p style={{ whiteSpace: 'pre-line' }}> หัวหน้างาน : {this.props.item.missionEmployees.employeesHead == null ? "" : this.props.item.missionEmployees.employeesHead.empHeadName}</p>
                    <p style={{ whiteSpace: 'pre-line' }}> เบอร์ภายใน : {this.props.item.empInphone}</p>
                    <p style={{ whiteSpace: 'pre-line' }}> เบอร์มือถือ : {this.props.item.empMobile}</p>
                    <p style={{ whiteSpace: 'pre-line' }}> อีเมล์ : {this.props.item.empEmail}</p>
                    <p style={{ whiteSpace: 'pre-line' }}> ชื่อเข้าใช้งาน : {this.props.item.username}</p>
                    <p style={{ whiteSpace: 'pre-line' }}> กุล่มผู้ใช้งาน : {this.props.item.groupUser.grpUsName}</p>
                </ModalBody>
            </span>
        )
    }
}