import React, { Component } from 'react'
import { ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import dayjs from 'dayjs'

export default class DetailModal extends Component {
    render() {
        var time = dayjs(this.props.item.dtsStartDate.toString()).format('HH:mm')

        return (
            <span>
                <ModalHeader toggle={this.props.click}>  {this.props.item.dtsLeadApprove ? <FontAwesomeIcon icon={['far', 'dot-circle']} style={{ color: "red", marginRight: '3px' }} /> : <FontAwesomeIcon icon={['far', 'circle']} style={{ color: "red", marginRight: '3px'}} />}
                     {time} {this.props.item.project.projCode} {this.props.item.taskType.taskType}
                </ModalHeader>
                <ModalBody style={{ overflowWrap: 'break-word' }}>
                    <p style={{ whiteSpace: 'pre-line' }}> รายละเอียด : {this.props.item.dtsTaskDesc}</p>
                    <p style={{ whiteSpace: 'pre-line' }}> หมายเหตุ : {this.props.item.dtsRemark}</p>
                </ModalBody>
            </span>
        )
    }
}