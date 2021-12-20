import React, { Component, useState } from 'react'
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, FormGroup, Label } from 'reactstrap'

const DropdownList = (props) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen(prevState => !prevState);

    const dropdowndata = props.dropdownlist.map((item, i) =>

        <DropdownItem key={i}>
            <div idm={item.ID} idnamem='DropdownID' namem='DropdownName' valuem={item.Name} onClick={props.handleDropdownChange}> {item.Name} </div>
        </DropdownItem>
    )

    return (
        <Dropdown style={{ marginLeft: '5px', width: '100%' }} size='sm' isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle caret className='btn-block blackstyledropdown'>
                {props.DropdownName}
            </DropdownToggle>
            <DropdownMenu className='btn-block itemwidthauto' style={{ clear: 'both' }}>
                {dropdowndata}

            </DropdownMenu>
        </Dropdown>
    )
}
export default DropdownList