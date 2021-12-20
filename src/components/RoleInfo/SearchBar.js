import React, { Component } from 'react'
import { Row, Col, Button, Label, FormGroup,Input } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AddEditRole from '../componentsReuse/AddEditRole'

export default class SearchBar extends Component {
    constructor() {
        super()
        this.state = {addClick: false, item: {roleId:'',roleShortName:'',roleName:'' } }
        this.handleAddEditRole = this.handleAddEditRole.bind(this)
        this.closeModal = this.closeModal.bind(this)
    }

    handleAddEditRole() {
        this.setState(prevState => ({ addClick: !prevState.addClick }))
    }

    closeModal() {
        this.setState({ addClick: false })
    }

    render() {

        return (
            <Row style={{ color: 'white' }}>
                <Col lg='12' md='12' sm='12' >
                    <Row style={{marginBottom:'15px'}}>
                        <Col lg='2' md='3' sm='12' xs='12'>
                            <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'left' }}>
                                <FontAwesomeIcon onClick={this.handleAddEditRole} icon={['fas', 'plus']} style={{ color: '#39B54A', margin: '5px', cursor: 'pointer' }} size='2x' /> <span onClick={this.handleAddEditRole} style={{ cursor: 'pointer' }} > ข้อมูล Role</span>
                                {this.state.addClick ?
                                    <AddEditRole
                                        handleAddEditRole={this.handleAddEditRole}
                                        showModal={this.state.addClick}
                                        name='add'
                                        item={this.state.item}
                                        maxRoleId={this.props.maxRoleId}
                                        closeModal={this.closeModal}
                                        fetchData={this.props.fetchData}
                                    />
                                : ''}
                            </div>
                        </Col>

                        <Col lg='5' md='6' sm='12' style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                            <Input onChange={this.props.handleTextChange} placeholder='กรอกข้อมูลชื่อเต็มหรือชื่อย่อที่ต้องการค้นหา' value={this.props.searchText} style={{ color: 'white', backgroundColor: '#21375F', border: '1px solid black', height: '30px', borderRadius: 0 }} />
                        </Col>
                    </Row>
                </Col>

            </Row>
       )
    }

}