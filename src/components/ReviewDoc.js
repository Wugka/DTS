import React, { Component, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import dayjs from 'dayjs'

export default class ReviewDoc extends Component {

    constructor() {
        super()
        this.state = {              
            jsondata: []
        }
    }

    //****************************************************************************************************************************************

    componentWillMount() {
        this.setState({ jsondata: this.props.jsondata})
    }

    //****************************************************************************************************************************************

    componentWillReceiveProps(nextProps) {

        this.setState({ jsondata: nextProps.jsondata.slice(0,4)})
    }
 
    //****************************************************************************************************************************************

    togglemodal(modalprops) {

        const [modal, setModal] = useState(false);
        const toggle = () => setModal(!modal);

        return (
            <span>
                <a style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={toggle}>{modalprops.tasktype}</a>
                <Modal contentClassName='reviewdocmodal' isOpen={modal} toggle={toggle}  >
                    <ModalHeader toggle={toggle}>  {modalprops.leadapp ? <FontAwesomeIcon icon={['far', 'dot-circle']} style={{ color: "red" }} /> : <FontAwesomeIcon icon={['far', 'circle']} style={{ color: "red" }} />} {modalprops.stime} {modalprops.pcode} {modalprops.tasktype} </ModalHeader>
                    <ModalBody style={{ overflowWrap: 'break-word' }}>
                        <p> รายละเอียด : <span>{modalprops.detail}</span></p>
                        <p> หมายเหตุ : <span>{modalprops.remark}</span></p>
                    </ModalBody>
                </Modal>
            </span>
        );

    }

    //****************************************************************************************************************************************

    render() {
        const rdocArray = []

        this.state.jsondata.length ?
    
            this.state.jsondata.map((item, index) => {
            var time = dayjs(item.dtsStartDate.toString()).format('HH:mm')

                rdocArray.push(<p style={{ paddingRight: '10px' }} key={index}>{item.dtsLeadApprove ? <FontAwesomeIcon icon={['far', 'dot-circle']} size='lg' style={{ color: "red", marginRight: '5px' }} /> : <FontAwesomeIcon icon={['far', 'circle']} size='lg' style={{ color: "red", marginRight: '5px' }} />}
                    {time} {item.project.projCode} <this.togglemodal leadapp={item.dtsLeadApprove} stime={time} pcode={item.project.projCode} tasktype={item.taskType.taskType} detail={item.dtsTaskDesc} remark={item.dtsRemark} /> </p>)
            }) : rdocArray.push(<p style={{ paddingRight: '25px', textAlign:'center' }} key={1}>ไม่พบกิจกรรมประจำวัน</p>);


       

        return (
            <div style={{ textAlign: 'center' }}>
                <div style={{ textAlign: 'left', display: 'inline-block', paddingLeft: '25px' }}>
                    {rdocArray}
                    <hr className="event-line" />
                </div>
            </div>
        )

    }


}