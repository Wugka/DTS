import React, { Component } from 'react'
import { Row, Col, Button, Label, FormGroup, Input} from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AddEditCustomer from '../Customer/AddEditCustomer'
import Dropdownlist from '../Customer/DropdownList'
import Select from 'react-select'
export default class SearchBar extends Component {
    constructor() {
        super()
        this.state = {addClick: false, item: {
                cusId: '', cusName: '', cusAddress: '', cusPhone: '', cusFax: '', cusWebsite: '', cusEmail: '', cusContact: '',
            cusContactEmail: '', stampDate: '', modifyDate: '', modifyEmpId: ''
        }, showModal: true, searchtext:''}
        this.handleAddEditCustomer = this.handleAddEditCustomer.bind(this)
        this.closeModal = this.closeModal.bind(this)
        
    }

    handleAddEditCustomer() {
        this.setState( ({ addClick: true, showModal: true }))
    }
    closeModal() {
        this.setState({ addClick: false});
    }
    
    render() {
       
        const underlingOptions = []

       //underlingOptions.push({ value: 0, label: 'ทั้งหมด' })
        const underlinglist = this.props.dropdownlist.map((item, key) => {
            underlingOptions.push({ key: key, value: item.ID, label: item.Name })
        }) 
        return (
            
            <Row style={{ color: 'white' }}>
                <Col lg='12' md='12' sm='12' >
                    <Row style={{ marginBottom: '15px' }}>
                        <Col lg='2' md='5' sm='12' xs='12'>
                            <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'left' }}>
                                <FontAwesomeIcon
                                    onClick={this.handleAddEditCustomer}
                                    icon={['fas', 'plus']}
                                    style={{ color: '#39B54A', margin: '5px', cursor: 'pointer' }}
                                    size='2x' />
                                <span onClick={this.handleAddEditCustomer} style={{ cursor: 'pointer', whiteSpace: 'nowrap' }} > ข้อมูลลูกค้า</span>
                                {this.state.addClick ?
                                    <AddEditCustomer
                                        handleAddEditCustomer={this.handleAddEditCustomer}
                                        showModal={this.state.showModal}
                                        fetchData={this.props.fetchData}
                                        name='add'
                                        item={this.state.item}
                                        closeModal={this.closeModal}
                                        MaxCusId={this.props.MaxCusId}
                                       
                                    />
                                    : ''}
                            </div>
                        </Col>

                        <Col lg='3' md='5' sm='12' style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', margin: '3px' }}>
                        
                               
                                    {/*<Dropdownlist handleDropdownChange={this.props.handleDropdownChange} dropdownlist={this.props.dropdownlist} DropdownName={this.props.DropdownName} />  */}                                 
                                    <Select
                                        classNamePrefix='selectsearchdtsblackstyle'
                                        defaultValue={{ label: this.props.DropdownName, value: this.props.DropdownID }}
                                       // name='underling'
                                        placeholder={this.props.dropdownlist}
                                        options={underlingOptions}
                                        isSearchable={true}
                                        onChange={(event) => this.props.handleDropdownChange(event)}
                                        noOptionsMessage={() => 'ไม่พบข้อมูล'}
                                    />
                               
                        
                        </Col>
                        <Col lg='3' md='5' sm='12' style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', margin: '3px' }}>
                            <Input
                                onChange={this.props.statesearchbox}
                                type="text"
                                value={this.props.searchtext}
                                name="searchtext"
                                placeholder='กรอกข้อมูลที่ต้องการค้นหา'
                                id="searchtext"
                                style={{ color: 'white', backgroundColor: '#21375F', border: '1px solid black', height: '30px', borderRadius: 0 }} />
                        </Col>
                        <Col lg='2' md='2' sm='6' xs='12' style={{ paddingTop: '5px' }}>
                            <Button onClick={this.props.handleClick} size='sm' outline color="danger" style={{ color: 'white' }}>ค้นหา</Button>
                        </Col>
                    </Row>
                </Col>

            </Row>
            
            )

    }
}