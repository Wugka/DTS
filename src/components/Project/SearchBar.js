import React, { Component } from 'react'
import { Row, Col, Button, Label, FormGroup, Input } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AddEditProject from './AddEditProject'
import Select from 'react-select'
import AuthService from '../AuthService';

const auth = new AuthService()

export default class SearchBar extends Component {
    constructor() {
        super()
        this.state = { addClick: false }
        this.handleAddEditProject = this.handleAddEditProject.bind(this)
        this.closeModal = this.closeModal.bind(this)
    }

    handleAddEditProject() {
        this.setState(prevState => ({ addClick: !prevState.addClick }))
    }

    closeModal() {
        this.setState({ addClick: false })
    }

    render() {
        const role = auth.getProfile().role
        const projectOptions = [{ key: 1, value: 1, label: 'ทั้งหมด' }, { key: 2, value: 2, label: 'รหัสโครงการ' }, { key: 3, value: 3, label: 'ชื่อโครงการ' }, { key: 4, value: 4, label: 'สถานะโครงการ' }, , { key: 5, value: 5, label: 'สถานะ' }]
        const projectStatusOptions = [{ key: 0, value: 6, label: 'เปิดใช้งาน' }, { key: 1, value: 7, label: 'ปิดใช้งาน' }]
        let projectStatusArray = []

        this.props.projectStatusArray ? this.props.projectStatusArray.map((item, key) => {
            projectStatusArray.push({ key: key, value: item.projStatusId, label: item.projStatusName })
        }) : []

        return (
            <Row style={{ color: 'white' }}>
                <Col lg='12' md='12' sm='12' >
                    <Row style={{ marginBottom: '15px' }}>
                        {role.toLowerCase() === 'lead' ? '' :
                            <Col lg='2' md='3' sm='12' xs='12'>
                                <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'left' }}>
                                    <FontAwesomeIcon
                                        onClick={this.handleAddEditProject}
                                        icon={['fas', 'plus']}
                                        style={{ color: '#39B54A', margin: '5px', cursor: 'pointer' }}
                                        size='2x' />
                                    <span onClick={this.handleAddEditProject} style={{ cursor: 'pointer', whiteSpace: 'nowrap' }} > ข้อมูลโครงการ</span>
                                    {this.state.addClick ?
                                        <AddEditProject
                                            handleAddEditProject={this.handleAddEditProject}
                                            showModal={this.state.addClick}
                                            name='add'
                                            item={this.state.item}
                                            closeModal={this.closeModal}
                                            fetchData={this.props.fetchData}
                                            projectStatusArray={this.props.projectStatusArray}
                                            projectTypeArray={this.props.projectTypeArray}
                                            projectWorkArray={this.props.projectWorkArray}
                                            customerArray={this.props.customerArray}
                                            roleArray={this.props.roleArray}
                                            employeeArray={this.props.employeeArray}
                                            projectGroupArray={this.props.projectGroupArray}
                                        />
                                        : ''}

                                </div>
                            </Col>
                        }


                        <Col lg='3' md='3' sm='12' style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', margin: '3px' }}>
                            <Select
                                classNamePrefix='selectsearchdtsblackstyle'
                                defaultValue={{ label: 'ทั้งหมด', value: 1 }}
                                name='project'
                                placeholder={this.props.projectDropdownOptionName}
                                options={projectOptions}
                                isSearchable={true}
                                onChange={(event) => this.props.handleDropdownChange(event)}
                                noOptionsMessage={() => 'ไม่พบข้อมูล'}
                            />
                        </Col>

                        <Col lg='4' md='5' sm='12' style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', margin: '3px' }}>
                            {this.props.projectDropdownOptionId == '5' || this.props.projectDropdownOptionId == '4' ?
                                this.props.projectDropdownOptionId == '5' ?
                                    <Select
                                        key={this.props.counter}
                                        classNamePrefix='selectsearchdtsblackstyle'
                                        defaultValue={{ label: 'เปิดใช้งาน', value: 4 }}
                                        name='projectstatus'
                                        placeholder={this.props.projectDropdownOptionName}
                                        options={projectStatusOptions}
                                        isSearchable={true}
                                        onChange={(event) => this.props.handleDropdownStatusChange(event, 'projectStatusDropdownOptionName', 'projectStatusOptionId')}
                                        noOptionsMessage={() => 'ไม่พบข้อมูล'}
                                    />
                                    :
                                    <Select
                                        key={this.props.counter}
                                        classNamePrefix='selectsearchdtsblackstyle'
                                        defaultValue={{ label: this.props.projectStatusSubDropdownOptionName, value: this.props.projectStatusSubOptionId }}
                                        placeholder={this.props.projectStatusSubDropdownOptionName}
                                        options={projectStatusArray}
                                        isSearchable={true}
                                        onChange={(event) => this.props.handleDropdownStatusChange(event, 'projectStatusSubDropdownOptionName', 'projectStatusSubOptionId')}
                                        noOptionsMessage={() => 'ไม่พบข้อมูล'}
                                    />

                                :
                                <Input
                                    onChange={this.props.handleTextChange}
                                    placeholder='กรอกข้อมูลที่ต้องการค้นหา'
                                    value={this.props.searchText}
                                    style={{ color: 'white', backgroundColor: '#21375F', border: '1px solid black', height: '30px', borderRadius: 0 }}
                                />}

                        </Col>
                        {/*<Col lg='2' style={{ paddingTop: '5px'}}>
                            <Button onClick={this.props.fetchData} size='sm' outline color="danger" style={{ color: 'white' }}>ค้นหา</Button>
                        </Col>*/}
                        
                    </Row>
                </Col>

            </Row>
        )
    }
}