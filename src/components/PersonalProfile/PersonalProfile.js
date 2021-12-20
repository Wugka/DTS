import React, { Component } from 'react'
import { Button, Modal, ModalBody, Label, Input, FormGroup, ModalHeader, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../../css/personalProfile.css'
import AuthService from '../AuthService';
import swal from 'sweetalert'
import axios from 'axios'

var auth = new AuthService()

export default class PersonalProfile extends Component {
    constructor() {
        super()
        this.state = {
            currentpassword: '', newpassword: '', newpasswordconfirm: '', showModal: true, error: {}
        }

        this.toggle = this.toggle.bind(this)
        this.passwordChangeConfirm = this.passwordChangeConfirm.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    //*******************************************************************************************************************************************************************************

    toggle() {
        this.setState({ showModal: false }, function () {
            this.props.history.goBack() // Moves the pointer in the history stack by -1 entries
        })
    }

    //*******************************************************************************************************************************************************************************

    handleChange(evt) {
        const name = evt.target.name
        const val = evt.target.value

        this.setState({
            [name]: val
        })
    }

    //*******************************************************************************************************************************************************************************


    async passwordChangeConfirm() {
        const profile = auth.getProfile()
        const empid = profile.nameid

        const webapiurl = await axios.get('api/ConfigFromAppSetting')
        const currentpassword = this.state.currentpassword
        const newpassword = this.state.newpassword
        const newpasswordconfirm = this.state.newpasswordconfirm
        const newErrors = { ...this.state.errors }

        let isError = false

        if (!isError) {
            if (!currentpassword) {
                newErrors["currentpassword"] = true
                isError = true
            }
            if (!newpassword) {
                newErrors["newpassword"] = true
                isError = true
            }
            if (!newpasswordconfirm) {
                newErrors["newpasswordconfirm"] = true
                isError = true
            }
            
        }

        if (isError) {
            this.setState({ error: newErrors })
            swal({ text: 'กรุณากรอกข้อมูลให้ครบถ้วน', icon: 'warning' })
            return
        }

        if (currentpassword === newpassword) {
            this.setState({ error: { currentpassword: true, newpassword: true } }, () => swal({ text: 'รหัสผ่านเดิมและรหัสผ่านใหม่ห้ามเหมือนกัน', icon: 'warning' }))
            return
        }
        if (newpassword !== newpasswordconfirm) {
            this.setState({ error: {newpassword:true,newpasswordconfirm:true} }, () => swal({ text: 'กรุณากรอกข้อมูล ยืนยันรหัสผ่านใหม่ให้ตรงกับรหัสผ่านใหม่', icon: 'warning' }))
            return
        }
        else if (newpassword.length > 10 || newpasswordconfirm.length > 10) {
            this.setState({ error: { newpassword: true, newpasswordconfirm: true } }, () => swal({ text: 'กรุณากรอกข้อมูล รหัสผ่านเข้าใช้งานจำนวนไม่เกิน 10', icon: 'warning' }))
            return
        }

        const jsondata = {
            currentpassword: currentpassword,
            newpassword: newpassword,
        }

        auth.fetchWithToken(webapiurl.data + '/api/v1/Employees/ChangePassword/' + empid, { method: 'PUT', data: jsondata })
            .then(response => {
                if (auth._IsSuccessResponse(response) === true) {
                    swal({ text: 'เปลียนรหัสผ่านสำเร็จ', icon: 'success' })
                        .then(this.setState({ currentpassword: '', newpassword: '', newpasswordconfirm: '', error: {} }))
                        .then(this.props.history.goBack())
                }
            })
            .catch(error => {
                if (error.response && error.response.data && error.response.data.message) {
                    this.setState({ error: { currentpassword:true} }, () => swal({ text: error.response.data.message, icon: 'warning' }))
                }
                else {
                    this.setState({ error: {} }, () => swal({ text: 'ไม่สามารถแก้ข้อมูลได้ โปรดลองใหม่ภายหลัง', icon: 'warning' }))
                }
            })

    }

    //*******************************************************************************************************************************************************************************

    render() {

        return (
            <div>
                <Modal contentClassName='reviewdocmodal' isOpen={this.state.showModal} toggle={this.toggle} size='lg' >
                    <ModalHeader toggle={this.toggle}>
                        <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                            <FontAwesomeIcon icon={['fas', 'edit']} style={{ color: '#39B54A', margin: '5px', }} size='1x' /> <span style={{ fontSize: '16px' }}> แก้ไขรหัสผ่าน</span>
                        </div>
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup row>
                            <Label for="currentpassword" sm={3}>รหัสผ่านเดิม</Label>
                            <Col sm={7}>
                                <Input
                                    onChange={this.handleChange}
                                    type="password" name="currentpassword"
                                    id="currentpassword"
                                    placeholder="Current Password"
                                    className={this.state.error['currentpassword'] ? 'personalProfileInputInvalid' : 'personalProfileInput'}
                                    value={this.state.currentpassword} />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="newpassword" sm={3}>รหัสผ่านใหม่</Label>
                            <Col sm={7}>
                                <Input
                                    onChange={this.handleChange}
                                    type="password"
                                    name="newpassword"
                                    id="newpassword"
                                    placeholder="New Password"
                                    className='personalProfileInput'
                                    className={this.state.error['newpassword'] ? 'personalProfileInputInvalid' : 'personalProfileInput'}
                                    value={this.state.newpassword} />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="newpasswordconfirm" sm={3}>ยืนยันรหัสผ่านใหม่</Label>
                            <Col sm={7}>
                                <Input
                                    onChange={this.handleChange}
                                    type="password"
                                    name="newpasswordconfirm"
                                    id="newpasswordconfirm"
                                    placeholder="New Password"
                                    className={this.state.error['newpasswordconfirm'] ? 'personalProfileInputInvalid' : 'personalProfileInput'}
                                    value={this.state.newpasswordconfirm} />
                            </Col>
                        </FormGroup>

                        <p style={{ textAlign: "center" }}>
                            <Button onClick={this.passwordChangeConfirm} outline color="danger" style={{ color: 'white', margin: '5px' }}>บันทึก</Button>
                            <Button onClick={this.toggle} outline color="danger" style={{ color: 'white', margin: '5px' }}>ยกเลิก</Button>
                        </p>

                    </ModalBody>
                </Modal>
            </div>

        )
    }


}