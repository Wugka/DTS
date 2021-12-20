import React, { Component } from 'react'
import { Form, FormGroup, PopoverBody, Input, Popover, PopoverHeader } from 'reactstrap';
import { Row, Col } from 'reactstrap';
import { Button } from 'reactstrap'
import AuthService from './AuthService'
import swal from 'sweetalert'
import amrlogo from '../img/logo W-01.png'
import dtslabel from '../img/Dally time sheet H-01.png'
import { WaveLoading } from 'react-loadingg';
import '../css/Login.css'
import ForgotPassword from './ForgotPassword'


var auth = new AuthService()

export default class Login extends Component {
    constructor() {
        super()
        this.state = { username: '', password: '',loading:false, opa:'1', showVersionModal: false, forgotPassword: false }
        this.handleChange = this.handleChange.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.enterPressed = this.enterPressed.bind(this)
        this.toggle = this.toggle.bind(this)
        this.toggleForgotPassword = this.toggleForgotPassword.bind(this)
    }

    //***************************************************************************************************

    componentDidMount() {
        //(console.log('didmount'))
        auth.logout() // clear token 
    }

    //***************************************************************************************************

    toggleForgotPassword() {
        this.setState(prevState => ({ forgotPassword: !prevState.forgotPassword }))
    }

    //***************************************************************************************************

    toggle() {
        this.setState(prevState => ({ showVersionModal: !prevState.showVersionModal }) )
    }

    //***************************************************************************************************

    enterPressed(event) {
        var code = event.keyCode || event.which

        if (code === 13) {
            this.handleClick()
        }
    }

    //***************************************************************************************************

    handleChange(e) {
        this.setState({ [e.target.name] : e.target.value })
    }

    //***************************************************************************************************

    handleClick() {
        this.setState({loading:true,opa:'0.6'})
       
        auth.login(this.state.username, this.state.password)    //click login ส่ง username password ไป AuthService เพื่อทำการเอา Token 
            .then(res => {
                if (res.statusText == 'OK') {
                    this.setState({ loading: false, opa:'1' })
                    swal({ text: 'เข้าสู่ระบบสำเร็จ', icon: 'success' })
                    { this.props.history.replace('/') }
                }
                else {
                    this.setState({ loading: false, opa: '1'  })
                    swal({ text: 'กรุณาตรวจสอบชื่อผู้ใช้งานหรือรหัสผ่านอีกครั้ง', icon: 'warning' })
                }
            })
            .catch(err => {
                this.setState({ loading: false, opa: '1'  })
                swal({ text: 'กรุณาตรวจสอบชื่อผู้ใช้งานหรือรหัสผ่านอีกครั้ง', icon: 'warning' })
            })
      
    }

    //***************************************************************************************************

    render() {

        return (
            <React.Fragment>
                <img src={dtslabel} style={{ position: 'absolute', width: '200px', height: '150px', top: '-35px', left: '-25px' }} />
                <div style={{ position: "absolute", top: '10%', width: '100%', overflowX: "hidden", opacity: this.state.opa }}>
                <Row>
                        <Col lg={{ size: 4, offset: 4 }} md={{ size: 6, offset: 3 }} sm={{ size: 6, offset: 3 }} style={{ textAlign: "center" }}>
                            <img style={{ width: '100%', position:'relative', right:'10px',top:'10px' }} src={amrlogo} />
                            <Form style={{ marginLeft: '20px', marginRight:'20px' }}>
                                <FormGroup>
                                    <Input 
                                    type="text"
                                    name="username"
                                    placeholder="USERNAME"
                                    value={this.state.username}
                                        onChange={this.handleChange}
                                        className='logininput'
                                        autoComplete='off'
                                        onKeyPress={this.enterPressed}
                                />
                            </FormGroup>

                            <FormGroup>
                                <Input
                                    type="password"
                                    name="password"
                                    placeholder="PASSWORD"
                                    value={this.state.password}
                                        onChange={this.handleChange}
                                        className='logininput'
                                        onKeyPress={this.enterPressed}
                                />
                            </FormGroup>
                        </Form>

                            <Button outline color="danger" style={{ color: 'white' }} onClick={this.handleClick}>Login</Button>
                            <div>
                                <p onClick={this.toggleForgotPassword}
                                    style={{ color: 'grey', margin: '10px', cursor: 'pointer', display: 'inline-block' }}>
                                    Forgot password?
                                </p>
                            </div>

                    </Col>
                </Row>
                
                </div>

                {this.state.forgotPassword ?
                    <ForgotPassword
                        forgotPassword={this.state.forgotPassword}
                        toggleForgotPassword={this.toggleForgotPassword}
                    />
                : ''}

                <div>
                    <div id='popoverV' onClick={this.toggle} style={{ position: 'absolute', bottom: '0', right: '0', color: 'white', margin: '10px', cursor: 'pointer', border: 'none' }}> V4.0 </div>
                    <Popover target='popoverV' isOpen={this.state.showVersionModal} toggle={this.toggle} placement='auto'>
                        <PopoverHeader style={{ backgroundColor: 'rgb(31, 51, 88)', color: 'grey', border: 'none', textDecoration:'underline' }} > Changelog </PopoverHeader>
                        <PopoverBody style={{ backgroundColor: 'rgb(31, 51, 88)', color: 'grey' }}>
                            <p style={{ marginBottom: '5px' }}>1. เมนูสำหรับผู้ดูแลระบบ</p>
                            {/* <p style={{ marginBottom: '5px' }}>2. เพิ่มรายงานรายโครงการ</p>
                            <p style={{ marginBottom: '5px' }}>2. ในdropdown สามารถ พิมพ์ค้นหาได้</p>
                            <p style={{ marginBottom: '5px' }}>3. หน้า บันทึกกิจกรรม ตาราง เพิ่ม เวลา เริ่มต้น สิ้นสุด</p>
                            <p style={{ marginBottom: '5px' }}>4. หน้าอนุมัติ  defaultเงือนไข ทั้งหมด  ในตาราง แสดง ลูกน้อง โดยตรงขึ้นก่อน </p>
                            <p style={{ marginBottom: '5px' }}>5. ปรับการแสดงผลรายงาน </p>
                            <p style={{ marginBottom: '5px' }}>6. ปรับการแสดงผลคำนวนใน  mobile </p>*/}
                        </PopoverBody>
                    </Popover>
                </div>

                {this.state.loading ? <WaveLoading />  : '' }
            </React.Fragment>
        )

    }

}