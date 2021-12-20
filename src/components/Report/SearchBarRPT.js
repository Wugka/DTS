import React, { Component } from 'react'
import LeaderDropdown from './LeaderDropdown'
import LeaderDropdownyear from './LeaderDropdownyear'
import LeaderDropdownmonth from './LeaderDropdownmonth'
import { Row, Col, Button, Label, FormGroup } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Select from 'react-select'
import '../../css/selectsearch.css'
import DtsDatePicker from '../componentsReuse/DtsDatePicker';

export default class SearchBarRPT extends Component {
    render() {
        const underlingOptions = []

        underlingOptions.push({ value: 0, label: 'ทั้งหมด' })
        const underlinglist = this.props.underlinglist ? this.props.underlinglist.map((item, key) => {
            underlingOptions.push({ key: key, value: item.empId, label: item.empName })
        }) : underlingOptions.push({ key: 0, value: 0, label: 'ไม่พบข้อมูล' })
        return (
           
            <Row style={{ color: 'white' }}>
                <Col lg='12' md='12' sm='12' >
                    <Row>                     
                        <Col lg='6' md='4' sm='12' style={{ whiteSpace: 'nowrap' }}>
                                <Row>
                                    <Col lg='6'>
                                        <DtsDatePicker startDate={this.props.startDate} name='startDate' labelname='เริ่มวันที่' handleChange={this.props.handleChange} unlimitpast={true} />
                                    </Col>
                                    <Col lg='6'>
                                        <DtsDatePicker startDate={this.props.stopDate} name='stopDate' labelname='ถึงวันที่' handleChange={this.props.handleChange} unlimitpast={true} />
                                    </Col>
                                </Row>
                        </Col>
                        <Col lg='5' md='6' sm='12' xs='12'>
                            <FormGroup row>
                                <Label for='dtsdropdown' lg={4} sm={4} style={{ bottom: '5px',whiteSpace:'nowrap' }}> ผู้ใต้บังคับบัญชา  </Label>
                                {/*<LeaderDropdown handleDropdownChange={this.props.handleDropdownChange} 
                                 * underlinglist={this.props.underlinglist} 
                                 * underlingDropdownName={this.props.underlingDropdownName} />*/}

                                <Col sm={7}>                                    
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
                      
                        <Col lg='1' md='2' sm='6' xs='12' style={{ marginBottom: '15px',whiteSpace:'nowrap' }}>
                            <Button onClick={this.props.handleClick} size='sm' outline color="danger" style={{ color: 'white' }}>Show Task</Button>
                        </Col>
                    </Row>
                </Col>

            </Row>
            
        )


    }
}