import React, { Component, useState } from 'react'
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, FormGroup, Label } from 'reactstrap'

const LeaderDropdownmonth = (props) => {

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen(prevState => !prevState);

    const dropdowndata = props.monthlist.map((item, i) =>
        <DropdownItem key={i}>
            <div idm={item.id} idnamem='underlingDropdownIdmonth' namem='underlingDropdownmonth' valuem={item.month_Name} onClick={props.handleDropdownChangemonth}> {item.month_Name} </div>
        </DropdownItem>
    )

    return (
        <Dropdown style={{ marginLeft: '5px', width: '100%' }} size='sm' isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle caret className='btn-block blackstyledropdown'>
                {props.underlingDropdownmonth}
            </DropdownToggle>
            <DropdownMenu className='btn-block itemwidthauto' style={{ clear: 'both' }}>
                {dropdowndata}

            </DropdownMenu>
        </Dropdown>
    )
}
export default LeaderDropdownmonth