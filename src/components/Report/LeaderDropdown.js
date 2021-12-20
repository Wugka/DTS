import React, { Component, useState } from 'react'
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, FormGroup, Label } from 'reactstrap'
import { Scrollbars } from 'react-custom-scrollbars';
const LeaderDropdown = (props) => {

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen(prevState => !prevState);
   
    const dropdowndata = props.underlinglist ? props.underlinglist.map((item, i) =>
        <DropdownItem key={i}>
            <div id={item.empId} idname='underlingDropdownId' name='underlingDropdownName' value={item.empName} onClick={props.handleDropdownChange}> {item.empName} </div>
        </DropdownItem>
    ) : <DropdownItem>ไม่พบข้อมูล</DropdownItem>

    return (
        <Dropdown style={{ marginLeft: '5px', width: '100%' }} size='sm' isOpen={dropdownOpen} toggle={toggle} >
            <DropdownToggle caret className='btn-block blackstyledropdown'>
                {props.underlingDropdownName}
            </DropdownToggle>
            <DropdownMenu className='btn-block itemwidthauto' style={{ clear: 'both' }}>
                <Scrollbars autoHeight>
                <DropdownItem>                 
                        <div name='underlingDropdownName' idname='underlingDropdownId' id='0' value='ทั้งหมด' onClick={props.handleDropdownChange}>ทั้งหมด</div>                   
                </DropdownItem>      
                    {dropdowndata}
                </Scrollbars>
            </DropdownMenu>
        </Dropdown>
    )
}

export default LeaderDropdown