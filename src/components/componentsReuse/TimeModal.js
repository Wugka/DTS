import React, { Component } from 'react'
import { ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment from 'moment'

export default class TimeModal extends Component {
    render() {

        const starttime = moment(this.props.item.dtsStartDate).format('DD/MM/YYYY HH:mm')
        const stoptime = moment(this.props.item.dtsStopDate).format('DD/MM/YYYY HH:mm')

        return (
            <span>
                <ModalHeader className='headerlessmodal' toggle={this.props.click}>
                    ข้อมูลเวลา
                </ModalHeader>
                <ModalBody style={{ overflowWrap: 'break-word' }}>
                    <p style={{ whiteSpace: 'pre-line' }}> เวลาเริ่มต้น - เวลาสิ้นสุด : {starttime} - {stoptime}</p>
                    <p style={{ whiteSpace: 'pre-line' }}> พักเที่ยง : 
                        {this.props.item.dtsBreak ?
                            <FontAwesomeIcon icon={['far', 'dot-circle']} size='lg' style={{ color: "red", paddingRight: '3px', position: 'relative',top:'1px',marginLeft:'3px' }} />
                            : <FontAwesomeIcon icon={['far', 'circle']} size='lg' style={{ color: "red", paddingRight: '3px', position: 'relative', top:'1px', marginLeft:'3px' }} />
                        }
                    </p>
                </ModalBody>
            </span>
        )
    }
}