import React, { Component } from 'react'
import { FormGroup, Input, Modal, ModalHeader, ModalBody, Label, FormFeedback, Col, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AuthService from '../AuthService';
import axios from 'axios'
import swal from 'sweetalert'

var auth = new AuthService()

export default class AddEditRole extends Component {
    constructor(props) {
        super(props)
        this.state = {
            roleId: props.item.roleId, roleShortName: props.item.roleShortName, roleName: props.item.roleName, maxRoleId: props.maxRoleId, error: {} }    // item.roleId , item.roleShortName, item.roleName
        this.handleChange = this.handleChange.bind(this)
        this.handleAddConfirm = this.handleAddConfirm.bind(this)
        this.handleEditConfirm = this.handleEditConfirm.bind(this)
    }

    //*******************************************************************************************************************************************************************************

    async handleAddConfirm(fd, cm) {
        const newErrors = { ...this.state.errors }
        const roleShortName = this.state.roleShortName
        const roleName = this.state.roleName
        let isError = false

        if (!isError) {
            if (!roleShortName || !roleShortName.replace(/\s/g, '').length) {
                newErrors["roleShortName"] = true
                isError = true
            }
            if (!roleName || !roleShortName.replace(/\s/g, '').length) {
                newErrors["roleName"] = true
                isError = true
            }
        }

        if (isError) {
            this.setState({ error: newErrors })
            swal({ text: 'กรุณากรอกข้อมูลให้ครบถ้วน', icon: 'warning' })
            return
        }

        const webapiurl = await axios.get('api/ConfigFromAppSetting')
        const jsondata = JSON.stringify({
            roleId: this.state.maxRoleId,
            roleShortName: this.state.roleShortName,
            roleName: this.state.roleName,
            roleFag: 0
        })

        swal({
            text: 'ท่านต้องการเพิ่มข้อมูลRole ' + this.state.roleShortName + ' ใช่หรือไม่',
            buttons: {
                ok: 'ตกลง',
                cancel: 'ยกเลิก'
            }
        }).then((value) => {

            switch (value) {
                case 'ok':
                    auth.fetchWithToken(webapiurl.data + '/api/v1/Roles', { method: 'POST', data: jsondata })
                        .then(response => {
                            if (auth._IsSuccessResponse(response)) {
                                swal({ text: 'เพิ่มข้อมูลสำเร็จ', icon: 'success' })
                                cm()
                                fd()
                            }
                        }).catch(error => {
                            console.log(error)
                            swal({ text: 'ไม่สามารถเพิ่มข้อมูลได้', icon: 'warning' })
                        })
                    break;
            }
        })
    }

    //*******************************************************************************************************************************************************************************

    async handleEditConfirm(fd, cm) {
        const newErrors = { ...this.state.errors }
        const roleShortName = this.state.roleShortName
        const roleName = this.state.roleName
        let isError = false

        if (!isError) {
            if (!roleShortName || !roleShortName.replace(/\s/g, '').length) {
                newErrors["roleShortName"] = true
                isError = true
            }
            if (!roleName || !roleShortName.replace(/\s/g, '').length) {
                newErrors["roleName"] = true
                isError = true
            }
        }

        if (isError) {
            this.setState({ error: newErrors })
            swal({ text: 'กรุณากรอกข้อมูลให้ครบถ้วน', icon: 'warning' })
            return
        }

        const webapiurl = await axios.get('api/ConfigFromAppSetting')
        const jsondata = JSON.stringify({
            roleId: this.state.roleId,
            roleShortName: this.state.roleShortName,
            roleName: this.state.roleName
        })

        swal({
            text: 'ท่านต้องการแก้ไขข้อมูลRole ' + this.state.roleShortName + ' ใช่หรือไม่',
            buttons: {
                ok: 'ตกลง',
                cancel: 'ยกเลิก'
            }
        }).then((value) => {

            switch (value) {
                case 'ok':
                    auth.fetchWithToken(webapiurl.data + '/api/v1/Roles/' + jsondata.roleId, { method: 'PUT', data: jsondata })
                        .then(response => {
                            if (auth._IsSuccessResponse(response)) {
                                swal({ text: 'แก้ไขข้อมูลสำเร็จ', icon: 'success' })
                                cm()
                                fd()
                            }
                        }).catch(error => {
                            swal({ text: 'ไม่สามารถแก้ไขข้อมูลได้', icon: 'warning' })
                            console.log(error)
                        })
                    break;
            }
        })

        
    }

    handleChange(e) {
        const name = e.target.name
        const val = e.target.value

        this.setState({
            [name]: val
        })
    }

    //*******************************************************************************************************************************************************************************

    render() {
        let header = ''
        let confirmBtn = ''
        let roleId = this.state.roleId

        if (this.props.name === 'add') {
            header = <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                <FontAwesomeIcon icon={['fas', 'plus']} style={{ color: '#39B54A', margin: '5px', }} size='1x' /> <span style={{ fontSize: '16px' }}>เพิ่มข้อมูล Role</span>
            </div>
            confirmBtn = <Button onClick={() => this.handleAddConfirm(this.props.fetchData, this.props.closeModal)} outline color="danger" style={{ color: 'white', margin: '5px' }}>ยืนยัน</Button>
            roleId = this.state.maxRoleId
        }
        else {
            header = <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                <FontAwesomeIcon icon={['fas', 'edit']} style={{ color: '#39B54A', margin: '5px', }} size='1x' /> <span style={{ fontSize: '16px' }}>แก้ไขข้อมูล Role</span>
            </div>
            confirmBtn = <Button onClick={() => this.handleEditConfirm(this.props.fetchData, this.props.closeModal)} outline color="danger" style={{ color: 'white', margin: '5px' }}>แก้ไข</Button>
        }

        return (
           
            <Modal contentClassName='reviewdocmodal' isOpen={this.props.showModal}>
                <ModalHeader toggle={this.props.closeModal}> {header}  </ModalHeader>
                <ModalBody>

                    <FormGroup row>
                        <Label for="roleid" sm={4}>รหัส Role</Label>
                        <Col sm={8}>
                            <Input type="text" value={roleId} name="roleId" id="roleId"
                                style={{
                                    color: 'grey',
                                    backgroundColor: 'rgb(31, 51, 88)',
                                    border: '1px solid black',
                                    marginBottom: '5px',
                                    borderRadius: '0',
                                    height:'30px'
                                }} readOnly />
                        </Col>
                    </FormGroup>

                    <FormGroup row>
                        <Label for="roleShortName" sm={4}>ชื่อย่อของ Role</Label>
                        <Col sm={8}>
                            <Input
                                autoComplete='off'
                                onChange={this.handleChange}
                                type="text"
                                value={this.state.roleShortName}
                                name="roleShortName"
                                id="roleShortName"
                                style={{ color: 'white', backgroundColor: '#21375F', border: '1px solid black', marginBottom: '5px' }}
                                className={this.state.error['roleShortName'] ? 'projTextboxInvalid' : 'projTextbox'}
                            />
                        </Col>
                    </FormGroup>

                    <FormGroup row>
                        <Label for="roleName" sm={4}>ชื่อเต็มของ Role</Label>
                        <Col sm={8}>
                            <Input
                                autoComplete='off'
                                onChange={this.handleChange}
                                type="text"
                                value={this.state.roleName}
                                name="roleName"
                                id="roleName"
                                style={{ color: 'white', backgroundColor: '#21375F', border: '1px solid black', marginBottom: '5px' }}
                                className={this.state.error['roleName'] ? 'projTextboxInvalid' : 'projTextbox'}
                            />
                        </Col>
                    </FormGroup>

                    <p style={{ textAlign: "center" }}>
                        {confirmBtn}
                        <Button onClick={this.props.handleAddEditRole} outline color="danger" style={{ color: 'white', margin: '5px' }}>ยกเลิก</Button>
                    </p>

                </ModalBody>
            </Modal>
        )
    }


}