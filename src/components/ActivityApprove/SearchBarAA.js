import React, { Component } from 'react'
import LeaderDropdown from './LeaderDropdown'
import { Row, Col, Button, Label, FormGroup } from 'reactstrap';
import DtsDatePicker from '../componentsReuse/DtsDatePicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Select from 'react-select'
import '../../css/selectsearch.css'
import '../../css/SearchBarAA.css'

export default class SearchBarAA extends Component {
    constructor() {
        super()
    }


    render() {

        const underlingOptions = []

        underlingOptions.push({ value: 0, label: 'ทั้งหมด' })
        const underlinglist = this.props.underlinglist ? this.props.underlinglist.map((item, key) => {
            underlingOptions.push({ key: key, value: item.empId, label: item.empName })
        }) : underlingOptions.push({ key: 0, value: 0, label: 'ไม่พบข้อมูล' })


        return (
            <React.Fragment>


                <Row style={{ color: 'white' }}>
                    <Col lg='11' md='12' sm='12'>
                        <Row>
                            <Col lg='6' md='5' sm='12' style={{ whiteSpace:'nowrap' }}>
                                <Row>
                                <Col lg='6'>
                                    <DtsDatePicker startDate={this.props.startDate} name='startDate' labelname='เริ่มวันที่' handleChange={this.props.handleChange} unlimitpast={true} />
                                </Col>
                                <Col lg='6'>
                                    <DtsDatePicker startDate={this.props.stopDate} name='stopDate' labelname='ถึงวันที่' handleChange={this.props.handleChange} unlimitpast={true} />
                                    </Col>
                                </Row>
                            </Col>

                            <Col lg='6' md='7'>
                                <FormGroup row>
                                    <Label for='leaderdropdown' className='leaderdropdownformgroup' style={{ bottom: '5px', whiteSpace: 'nowrap' }} sm={4}> ผู้ใต้บังคับบัญชา </Label>
                                    <Col sm={8}>
                                        <Select
                                            classNamePrefix='selectsearchdtsblackstyle'
                                            defaultValue={{ label: this.props.underlingDropdownName, value: this.props.underlingDropdownId }}
                                            name='underling'
                                            placeholder={this.props.underlingDropdownName}
                                            options={underlingOptions}
                                            isSearchable={true}
                                            onChange={(event) => this.props.handleDropdownChange(event)}
                                            noOptionsMessage={() => 'ไม่พบข้อมูล'}
                                        />
                                    </Col>
                                </FormGroup>
                                
                            </Col>
                        </Row>
                    </Col>
                </Row>


                <Row style={{ color: 'white', marginBottom:'15px' }}>
                    <Col lg={{ size: '12' }}>
                        <label className='dblock' style={{ marginRight: '5px' }}> สถานะอนุมัติกิจกรรม: </label>
                        {this.props.passstatus === true ?
                            <FontAwesomeIcon icon={['far', 'dot-circle']} size='lg' style={{ color: "red", cursor: 'pointer' }} /> :
                            <FontAwesomeIcon onClick={(e) => this.props.handleRadioClick(e, 'passstatus')} icon={['far', 'circle']} size='lg' style={{ color: "red", cursor: 'pointer' }} />
                        }
                        <span style={{ marginRight: '5px' }}> อนุมัติ</span>

                        {this.props.failstatus === true ?
                            <FontAwesomeIcon icon={['far', 'dot-circle']} size='lg' style={{ color: "red", cursor: 'pointer' }} /> :
                            <FontAwesomeIcon onClick={(e) => this.props.handleRadioClick(e, 'failstatus')} icon={['far', 'circle']} size='lg' style={{ color: "red", cursor: 'pointer' }} />}
                        <span style={{ marginRight: '5px' }}> ไม่อนุมัติ</span>

                        {this.props.bothstatus === true ?
                            <FontAwesomeIcon icon={['far', 'dot-circle']} size='lg' style={{ color: "red", cursor: 'pointer' }} /> :
                            <FontAwesomeIcon onClick={(e) => this.props.handleRadioClick(e, 'bothstatus')} icon={['far', 'circle']} size='lg' style={{ color: "red", cursor: 'pointer' }} />}
                        <span style={{ marginRight: '5px' }}> ทั้งหมด</span>


                        <Button onClick={this.props.showtaskresetpage} className='btnmargin' size='sm' outline color="danger" style={{ color: 'white', marginRight: '5px', marginBottom: '5px' }}>Show Task</Button>
                        {this.props.jsondata.length ? <Button onClick={this.props.updateStatusApprove} size='sm' outline color="danger" style={{ color: 'white', marginBottom:'5px' }}>Update Status Approve</Button> : ''} 
                    </Col>
                </Row>
            </React.Fragment>

        )

    }

}