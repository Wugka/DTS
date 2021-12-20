import React, { Component } from 'react'
import { ModalHeader, ModalBody } from 'reactstrap'

export default class ProjectModal extends Component {
    render() {
        return (
            <span>
                <ModalHeader className='headerlessmodal' toggle={this.props.click}>
                    ข้อมูลโครงการ
                </ModalHeader>
                <ModalBody style={{ overflowWrap: 'break-word' }}>
                    <p style={{ whiteSpace: 'pre-line' }}> รหัสโครงการ : {this.props.item.project.projCode}</p>
                    <p style={{ whiteSpace: 'pre-line' }}> ชื่อโครงการ : {this.props.item.project.projName}</p>
                </ModalBody>
            </span>
        )
    }
}