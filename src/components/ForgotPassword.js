import React, { Component } from 'react'
import swal from 'sweetalert'
import axios from 'axios'
import { Button, Modal, ModalBody, Label, Input, FormGroup, ModalHeader, Col } from 'reactstrap';
import AuthService from './AuthService'
import { WaveLoading } from 'react-loadingg';

const auth = new AuthService()

export default class ForgotPassword extends Component {

    constructor() {
        super()
        this.state = { useremail: '', loading: false }
        this.handleChange = this.handleChange.bind(this)
        this.sendEmail = this.sendEmail.bind(this)
    }

    //***************************************************************************************************

    async sendEmail() {

        const webapiurl = await axios.get('api/ConfigFromAppSetting')

        const mail = this.state.useremail
        if (mail == null || mail == '') {
            swal({ text: 'โปรดกรอก Email ของคุณ', icon: 'warning' })
            return
        }

        this.setState({ loading: true })
        axios({
            method: 'POST',
            url: webapiurl.data + '/api/v1/Employees/sendEmail',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            data: { EmpEmail: mail },

        })
            .then(response => {
                if (auth._IsSuccessResponse(response) === true) {
                    this.setState({ loading: false })
                    swal({ text: 'ระบบได้ทำการส่งรหัสไปยัง Email ของคุณแล้ว', icon: 'success' })
                }
            })
            .catch(error => {
                this.setState({ loading: false })
                if (error.response && error.response.data && error.response.data.message) {
                    swal({ text: error.response.data.message, icon: 'warning' })
                }
                else {
                    swal({ text: 'ระบบขัดข้อง โปรดลองใหม่ภายหลัง', icon: 'warning' })
                }

            })


    }

    //***************************************************************************************************

    handleChange(e) {
        const value = e.target.value
        this.setState({
            useremail: value
        })
    }

    //***************************************************************************************************

    render() {

        return (
            <React.Fragment>
                <Modal centered contentClassName='reviewdocmodal' isOpen={this.props.forgotPassword} toggle={this.props.toggleForgotPassword} size='md' >
                    <ModalHeader toggle={this.props.toggleForgotPassword} style={{ borderBottom: 'none', paddingBottom: '0px' }}>
                    </ModalHeader>
                    <ModalBody>
                        <div style={{ textAlign: 'center' }}>
                            <h4>ลืมบัญชีผู้ใช้งาน</h4>
                            <p>กรุณากรอก Email ผู้ใช้งาน</p>
                        </div>
                        <Input
                            onChange={this.handleChange}
                            type="email"
                            name="useremail"
                            id="useremail"
                            autoComplete='off'
                            placeholder="Email ผู้ใช้งาน"
                            className='personalProfileInput'
                            value={this.state.useremail} />

                        <p style={{ textAlign: "center" }}>
                            <Button onClick={this.sendEmail} outline color="danger" style={{ color: 'white', margin: '10px' }}>ส่งคำร้อง</Button>
                        </p>

                    </ModalBody>
                    {this.state.loading ? <WaveLoading /> : ''}
                </Modal>


            </React.Fragment>

        )
    }

}