import React, { Component, useState } from 'react'
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, FormGroup, Label } from 'reactstrap'

const LeaderDropdownyear = (props) => { 

const [dropdownOpen, setDropdownOpen] = useState(false);
const toggle = () => setDropdownOpen(prevState => !prevState);
    const now = new Date()
const dropdowndata =  props.yearlist.map((item, i) =>
    <DropdownItem key={i}>
        <div idy={item.id} idnamey='underlingDropdownIdyear' namey='underlingDropdownyear' valuey={item.years} onClick={props.handleDropdownChangeyear}> {item.years} </div>
    </DropdownItem>
) 

return (
    <Dropdown style={{ marginLeft: '5px', width: '100%'}} size='sm' isOpen={dropdownOpen} toggle={toggle}>
        <DropdownToggle caret className='btn-block blackstyledropdown'>
            {props.underlingDropdownyear}
        </DropdownToggle>
        <DropdownMenu className='btn-block itemwidthauto' style={{ clear: 'both' }}>
           
               {dropdowndata}
            
        </DropdownMenu>
    </Dropdown>
  )
}
export default LeaderDropdownyear