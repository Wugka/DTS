import React, { Component } from 'react'
import { ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class DetailModal extends Component {

    render() {
        let header = <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
            <FontAwesomeIcon icon={['fas', 'plus']} style={{ color: '#39B54A', margin: '5px', }} size='1x' /> <span style={{ fontSize: '16px' }}> รายละเอียดข้อมูลลูกค้า</span>
        </div>
        return (
            <span>
                <ModalHeader toggle={this.props.click}> {header}  </ModalHeader>
                <ModalBody style={{ overflowWrap: 'break-word' }}>
                    <p style={{ whiteSpace: 'pre-line' }}> รหัสลูกค้า : {this.props.item.cusId}</p>
                    <p style={{ whiteSpace: 'pre-line' }}> ชื่อลูกค้า : {this.props.item.cusName}</p>
                    <p style={{ whiteSpace: 'pre-line' }}> ที่อยู๋ลูกค้า : {this.props.item.cusAddress}</p>
                    <p style={{ whiteSpace: 'pre-line' }}> เบอร์โทรศัพท์ : {this.props.item.cusPhone}</p>
                    <p style={{ whiteSpace: 'pre-line' }}> เบอร์แฟกซ์ : {this.props.item.cusFax}</p>
                    <p style={{ whiteSpace: 'pre-line' }}> เว็บไซต์ : {this.props.item.cusWebsite}</p>
                    <p style={{ whiteSpace: 'pre-line' }}> อีเมล์ : {this.props.item.cusEmail}</p>
                    <p style={{ whiteSpace: 'pre-line' }}> ชื่อผู้ติดต่อ : {this.props.item.cusContact}</p>
                    <p style={{ whiteSpace: 'pre-line' }}> อีเมล์ผู้ติดต่อ : {this.props.item.cusContactEmail}</p>
                </ModalBody>
            </span>
            )
    }
}