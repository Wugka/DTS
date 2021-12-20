import React, { Component } from 'react'
import { FormGroup, Input, Modal, ModalHeader, ModalBody, Label, FormFeedback,Row, Col, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AuthService from '../AuthService';
import axios from 'axios'
import swal from 'sweetalert'
var auth = new AuthService()

export default class AddEditCustomer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cusId: props.item.cusId, cusName: props.item.cusName, cusAddress: props.item.cusAddress,
            cusPhone: props.item.cusPhone, cusFax: props.item.cusFax, cusWebsite: props.item.cusWebsite,
            cusEmail: props.item.cusEmail, cusContact: props.item.cusContact, cusContactEmail: props.item.cusContactEmail, error: {}       
        }   
        this.handleChange = this.handleChange.bind(this)
        this.handleAddConfirm = this.handleAddConfirm.bind(this)
        this.handleEditConfirm = this.handleEditConfirm.bind(this)

    }
   
    async handleAddConfirm(evt, cm) {
        
        const newError = { ...this.state.error }
        const cusName = this.state.cusName
        if (!cusName || !cusName.replace(/\s/g, '').length) {
            newError["cusName"] = true
            this.setState({ error: newError })
            swal({ text: 'กรุณากรอกข้อมูลชื่อลูกค้า', icon: 'warning' })
            return
        }
        const cusAddress = this.state.cusAddress
        if (!cusAddress || !cusAddress.replace(/\s/g, '').length) {
            newError["cusAddress"] = true
            this.setState({ error: newError })
            swal({ text: 'กรุณากรอกข้อมูลที่อยู่ลูกค้า', icon: 'warning' })
            return
        }
        //const cusPhone = this.state.cusPhone
        //if (!cusPhone || !cusPhone.replace(/\s/g, '').length) {
        //    newError["cusPhone"] = true
        //    this.setState({ error: newError })
        //    return
        //}
        //const cusFax = this.state.cusFax
        //if (!cusFax || !cusFax.replace(/\s/g, '').length) {
        //    newError["cusFax"] = true
        //    this.setState({ error: newError })
        //    return
        //}
        
        //const cusWebsite = this.state.cusWebsite
        //if (!cusWebsite || !cusWebsite.replace(/\s/g, '').length) {
        //    newError["cusWebsite"] = true
        //    this.setState({ error: newError })
        //    return
        //}
        //const cusEmail = this.state.cusEmail
        //if (!cusEmail || !cusEmail.replace(/\s/g, '').length) {
        //    newError["cusEmail"] = true
        //    this.setState({ error: newError })
        //    return
        //}
        //const cusContact = this.state.cusContact
        //if (!cusContact || !cusContact.replace(/\s/g, '').length) {
        //    newError["cusContact"] = true
        //    this.setState({ error: newError })
        //    return
        //}
        //const cusContactEmail = this.state.cusContactEmail
        //if (!cusContactEmail || !cusContactEmail.replace(/\s/g, '').length) {
        //    newError["cusContactEmail"] = true
        //    this.setState({ error: newError })
        //    return
        //}


        const webapiurl = await axios.get('api/ConfigFromAppSetting')
        const jsondata = JSON.stringify({
            cusId: this.props.MaxCusId,
            cusName: this.state.cusName,
            cusAddress: this.state.cusAddress,
            cusPhone: this.state.cusPhone,
            cusFax: this.state.cusFax,
            cusWebsite: this.state.cusWebsite,
            cusEmail: this.state.cusEmail,
            cusContact: this.state.cusContact,
            cusContactEmail: this.state.cusContactEmail
           
        })

        auth.fetchWithToken(webapiurl.data + '/api/v1/Customers', { method: 'POST', data: jsondata })
            .then(response => {               
                if (auth._IsSuccessResponse(response)) {
                    swal({ text: 'เพิ่มข้อมูลสำเร็จ', icon: 'success' })
                    evt()
                    cm()
                }
            }).catch(error => {
                swal({ text: 'ไม่สามารถเพิ่มข้อมูลได้', icon: 'warning' })
            })
    }
   
    async handleEditConfirm(evt,cm) {
      //  console.log('handleeditconfirm Addeditcustomer')
        const newError = { ...this.state.error }
        const cusName = this.state.cusName
        if (!cusName || !cusName.replace(/\s/g, '').length) {
            newError["cusName"] = true
            this.setState({ error: newError })
            swal({ text: 'กรุณากรอกข้อมูลชื่อลูกค้า', icon: 'warning' })
            return
        }
        const cusAddress = this.state.cusAddress
        if (!cusAddress || !cusAddress.replace(/\s/g, '').length) {
            newError["cusAddress"] = true
            this.setState({ error: newError })
            swal({ text: 'กรุณากรอกข้อมูลที่อยู่ลูกค้า', icon: 'warning' })
            return
        }
        //const cusPhone = this.state.cusPhone
        //if (!cusPhone || !cusPhone.replace(/\s/g, '').length) {
        //    newError["cusPhone"] = true
        //    this.setState({ error: newError })
        //    return
        //}
        //const cusFax = this.state.cusFax
        //if (!cusFax || !cusFax.replace(/\s/g, '').length) {
        //    newError["cusFax"] = true
        //    this.setState({ error: newError })
        //    return
        //}

        //const cusWebsite = this.state.cusWebsite
        //if (!cusWebsite || !cusWebsite.replace(/\s/g, '').length) {
        //    newError["cusWebsite"] = true
        //    this.setState({ error: newError })
        //    return
        //}
        //const cusEmail = this.state.cusEmail
        //if (!cusEmail || !cusEmail.replace(/\s/g, '').length) {
        //    newError["cusEmail"] = true
        //    this.setState({ error: newError })
        //    return
        //}
        //const cusContact = this.state.cusContact
        //if (!cusContact || !cusContact.replace(/\s/g, '').length) {
        //    newError["cusContact"] = true
        //    this.setState({ error: newError })
        //    return
        //}
        //const cusContactEmail = this.state.cusContactEmail
        //if (!cusContactEmail || !cusContactEmail.replace(/\s/g, '').length) {
        //    newError["cusContactEmail"] = true
        //    this.setState({ error: newError })
        //    return
        //}
       
        const webapiurl = await axios.get('api/ConfigFromAppSetting')
        const jsondata = JSON.stringify({
            cusId: this.state.cusId,
            cusName: this.state.cusName,
            cusAddress: this.state.cusAddress,
            cusPhone: this.state.cusPhone,
            cusFax: this.state.cusFax,
            cusWebsite: this.state.cusWebsite,
            cusEmail: this.state.cusEmail,
            cusContact: this.state.cusContact,
            cusContactEmail: this.state.cusContactEmail

        })

        auth.fetchWithToken(webapiurl.data + '/api/v1/Customers', { method: 'PUT', data: jsondata })
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

    handleChange(e) {
        const name = e.target.name
        const val = e.target.value
       
        this.setState({
            [name]: val
        })
    }




    render() {
        let header = ''
        let confirmBtn = ''
        let MaxCusid = ''
       //s console.log('props name ' + this.props.name)
       
        if (this.props.name === 'edit') {          
            header = <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                <FontAwesomeIcon icon={['fas', 'edit']} style={{ color: '#39B54A', margin: '5px', }} size='1x' /> <span style={{ fontSize: '16px' }}> แก้ไขข้อมูลลูกค้า</span>
            </div>
            MaxCusid = <Input type="text" defaultValue={this.state.cusId} name="cusId" id="cusId" style={{ color: 'grey', backgroundColor: '#21375F', border: '1px solid black', marginBottom: '5px' }} readOnly/>
            confirmBtn = <Button onClick={() => this.handleEditConfirm(this.props.fetchData,this.props.closeModal)} outline color="danger" style={{ color: 'white', margin: '5px' }}>แก้ไข</Button>
        }
        else {
            header = <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                <FontAwesomeIcon icon={['fas', 'plus']} style={{ color: '#39B54A', margin: '5px', }} size='1x' /> <span style={{ fontSize: '16px' }}> เพิ่มข้อมูลลูกค้า</span>
            </div>
            MaxCusid = <Input type="text" defaultValue={this.props.MaxCusId} name="cusId" id="cusId" style={{ color: 'grey', backgroundColor: '#21375F', border: '1px solid black', marginBottom: '5px' }} readOnly />
            confirmBtn = <Button onClick={() => this.handleAddConfirm(this.props.fetchData, this.props.closeModal)} outline color="danger" style={{ color: 'white', margin: '5px' }}>ยืนยัน</Button>
        }
       
        return (
            <Modal contentClassName='reviewdocmodal' isOpen={this.props.showModal} toggle={this.props.closeModal}>
                <ModalHeader toggle={this.props.closeModal}> {header}  </ModalHeader>
                <ModalBody>

                    <FormGroup row>
                        <Label for="cusId" sm={4}>รหัสลูกค้า</Label>
                        <Col sm={8}>
                            {MaxCusid}
                        </Col>
                    </FormGroup>

                    <FormGroup row>
                        <Label for="cusName" sm={4}>ชื่อลูกค้า</Label>
                        <Col sm={8}>
                            <Input className={this.state.error['cusName'] ? 'projTextboxInvalid' : 'projTextbox'}
                                onChange={this.handleChange} type="text" value={this.state.cusName} name="cusName" id="cusName" style={{ color: 'white', backgroundColor: '#21375F', border: '1px solid black', marginBottom: '5px' }} />
                            
                        </Col>
                    </FormGroup>

                    <FormGroup row>
                        <Label for="cusAddress" sm={4}>ที่อยู่ลูกค้า</Label>
                        <Col sm={8}>
                            <Input className={this.state.error['cusName'] ? 'projTextboxInvalid' : 'projTextbox'}
                                onChange={this.handleChange} type="text" value={this.state.cusAddress} name="cusAddress" id="cusAddress" style={{ color: 'white', backgroundColor: '#21375F', border: '1px solid black', marginBottom: '5px' }} />
                           
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="cusPhone" sm={4}>เบอร์โทรศัพท์</Label>
                        <Col sm={8}>
                            <Input /*invalid={this.state.error['cusPhone']} */ onChange={this.handleChange} type="text" value={this.state.cusPhone} name="cusPhone" id="cusPhone" style={{ color: 'white', backgroundColor: '#21375F', border: '1px solid black', marginBottom: '5px' }} />
                            {/*{this.state.error['cusPhone'] ? <FormFeedback>*กรุณากรอกข้อมูลให้ครบถ้วน</FormFeedback> : ''}*/}
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="cusFax" sm={4}>เบอร์แฟกซ์</Label>
                        <Col sm={8}>
                            <Input /*invalid={this.state.error['cusPhone']}*/ onChange={this.handleChange} type="text" value={this.state.cusFax} name="cusFax" id="cusFax" style={{ color: 'white', backgroundColor: '#21375F', border: '1px solid black', marginBottom: '5px' }} />
                            {/*{this.state.error['cusFax'] ? <FormFeedback>*กรุณากรอกข้อมูลให้ครบถ้วน</FormFeedback> : ''}*/}
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="cusWebsite" sm={4}>เว็บไซต์</Label>
                        <Col sm={8}>
                            <Input /*invalid={this.state.error['cusWebsite']}*/ onChange={this.handleChange} type="text" value={this.state.cusWebsite} name="cusWebsite" id="cusWebsite" style={{ color: 'white', backgroundColor: '#21375F', border: '1px solid black', marginBottom: '5px' }} />
                            {/*{this.state.error['cusWebsite'] ? <FormFeedback>*กรุณากรอกข้อมูลให้ครบถ้วน</FormFeedback> : ''}*/}
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="cusEmail" sm={4}>อีเมล์</Label>
                        <Col sm={8}>
                            <Input /*invalid={this.state.error['cusEmail']}*/ onChange={this.handleChange} type="text" value={this.state.cusEmail} name="cusEmail" id="rocusEmailleName" style={{ color: 'white', backgroundColor: '#21375F', border: '1px solid black', marginBottom: '5px' }} />
                            {/*{this.state.error['cusEmail'] ? <FormFeedback>*กรุณากรอกข้อมูลให้ครบถ้วน</FormFeedback> : ''}*/}
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="cusContact" sm={4}>ชื่อผู้ติดต่อ</Label>
                        <Col sm={8}>
                            <Input /*invalid={this.state.error['cusContact']}*/ onChange={this.handleChange} type="text" value={this.state.cusContact} name="cusContact" id="cusContact" style={{ color: 'white', backgroundColor: '#21375F', border: '1px solid black', marginBottom: '5px' }} />
                            {/*{this.state.error['cusContact'] ? <FormFeedback>*กรุณากรอกข้อมูลให้ครบถ้วน</FormFeedback> : ''}*/}
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="cusContactEmail" sm={4}>อีเมล์ผู้ติดต่อ</Label>
                        <Col sm={8}>
                            <Input /*invalid={this.state.error['cusContactEmail']}*/ onChange={this.handleChange} type="text" value={this.state.cusContactEmail} name="cusContactEmail" id="cusContactEmail" style={{ color: 'white', backgroundColor: '#21375F', border: '1px solid black', marginBottom: '5px' }} />
                            {/*{this.state.error['cusContactEmail'] ? <FormFeedback>*กรุณากรอกข้อมูลให้ครบถ้วน</FormFeedback> : ''}*/}
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
