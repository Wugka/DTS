import React, { Component } from 'react'
import { Row, Col, Button, Label, FormGroup } from 'reactstrap';
import DtsDatePicker from '../componentsReuse/DtsDatePicker';
import Select from 'react-select'
import '../../css/selectsearch.css'

export default class SearchBarAH extends Component {

    render() {

        const projectOptions = []

        projectOptions.push({value: 0, label:'ทั้งหมด'})
        const projlist = this.props.projectlist ? this.props.projectlist.map((item, key) => {
            projectOptions.push({ key: key, value: item.project.projId, label: item.project.projCode + ' ' + item.project.projName })
        }) : projectOptions.push({ key: 0, value: 0, label: 'ไม่พบข้อมูล' })

        return (
            <Row style={{ color: 'white' }}>
                <Col lg='12' md='12' sm='12' >
                    <Row>
                        <Col lg={{ size: '4' }} md={{ size: '5' }} sm='12' xs='12'>
                            <FormGroup row>
                                <Label for='dtsdropdown' sm={3} style={{ bottom: '5px' }}> โครงการ </Label>
                                <Col sm={9}>
                                    <Select
                                        classNamePrefix='selectsearchdtsblackstyle'
                                        defaultValue={{ label: this.props.projectname, value: this.props.projectid }}
                                        name='project'
                                        placeholder={this.props.projectname}
                                        options={projectOptions}
                                        isSearchable={true}
                                        onChange={(event) => this.props.handleDropdownChange(event, 'project')}
                                        noOptionsMessage={() => 'ไม่พบข้อมูล'}
                                    />
                                </Col>
                            </FormGroup>
                            
                        </Col>

                        <Col lg='6' md='5' sm='12' style={{ whiteSpace: 'nowrap' }}>
                            <Row>
                            <Col lg='6' md='12'>
                                    <DtsDatePicker
                                        startDate={this.props.startDate}
                                        name='startDate'
                                        labelname='เริ่มวันที่'
                                        handleChange={this.props.handleChange}
                                        unlimitpast={true}
                                 />
                            </Col>
                            <Col lg='6' md='12'>
                                    <DtsDatePicker
                                        startDate={this.props.stopDate}
                                        name='stopDate'
                                        labelname='ถึงวันที่'
                                        handleChange={this.props.handleChange}
                                        unlimitpast={true}
                                     />
                                </Col>
                            </Row>
                        </Col>

                        <Col lg='2' md='2' sm='6' xs='12' style={{ marginBottom: '15px' }}>
                            <Button onClick={this.props.handleClick} size='sm' outline color="danger" style={{ color: 'white',position:'relative',bottom:'2px' }}>Show Task</Button>
                        </Col>
                    </Row>
                </Col>

            </Row>

        )
    }

}