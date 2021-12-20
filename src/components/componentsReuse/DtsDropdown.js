import React, { useState } from 'react'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, FormGroup, Label } from 'reactstrap'
import { Scrollbars } from 'react-custom-scrollbars';

const DtsDropdown = (props) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen(prevState => !prevState);

    
    const dropdowndata = props.itemlist ? props.itemlist.map((item, i) => 
        <DropdownItem key={i}>
            <div className='projectDD' name='projectName' id={item.project.projId} idname='projectId' value={[item.project.projCode, item.project.projName].join(' ')} onClick={props.handleDropdownChange}>{item.project.projCode} {item.project.projName}</div>
        </DropdownItem>
    ) : <DropdownItem>ไม่พบข้อมูล</DropdownItem>

    return (
        <Dropdown style={{ width:'100%' }} size='sm' isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle caret className='btn-block blackstyledropdown'>
                {props.projectname}
                </DropdownToggle>
            <DropdownMenu className='btn-block itemwidthauto' style={{ clear: 'both' }}>
                <Scrollbars autoHeight>
                <DropdownItem>
                    <div name='projectName' id='0' idname='projectId' value='ทั้งหมด' onClick={props.handleDropdownChange}>ทั้งหมด</div>
                </DropdownItem>
                    {dropdowndata}
                </Scrollbars>
            </DropdownMenu>
        </Dropdown>

    )
}

export default DtsDropdown