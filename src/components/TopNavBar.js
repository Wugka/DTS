import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import { Navbar, NavItem, NavbarToggler, Collapse, DropdownToggle, DropdownMenu, DropdownItem, Dropdown } from 'reactstrap';
import { Redirect, NavLink } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import "../css/TopNavBar.css"
import AuthService from './AuthService'
import dtslabel from '../img/Dally time sheet H-01.png'
import swal from 'sweetalert'

var auth = new AuthService()

export default class TopNavBar extends Component {
    constructor() {
        super()
        this.state = { logout: false, collapsed: false, admindropdown: false, reportdropdown: false }

        this.handleLogout = this.handleLogout.bind(this)
        this.handleCollapse = this.handleCollapse.bind(this)
        this.toggle = this.toggle.bind(this)
        this.togglereport = this.togglereport.bind(this)
        this.mouseOver = this.mouseOver.bind(this)
        this.mouseOverReport = this.mouseOverReport.bind(this)
        this.mouseLeave = this.mouseLeave.bind(this)
        this.mouseLeaveReport = this.mouseLeaveReport.bind(this)
    }

    toggle() {
        this.setState(prevState => ({ admindropdown: !prevState.admindropdown }))
    }

    mouseOver() {
        if (auth.loggedIn()) {
            this.setState({ admindropdown: true })
        }
        else {
            swal({ text: 'Token หมดอายุ กรุณาทำการล็อคอินอีกครั้ง', icon: 'warning' })
                .then(window.location.href = '/Login')
        }
    }

    mouseLeave() {
        this.setState({ admindropdown: false })
    }

    togglereport() {
        this.setState(prevState => ({ reportdropdown: !prevState.reportdropdown }))
    }
    mouseOverReport() {
        if (auth.loggedIn()) {
            this.setState({ reportdropdown: true })
        }
        else {
            swal({ text: 'Token หมดอายุ กรุณาทำการล็อคอินอีกครั้ง', icon: 'warning' })
                .then(window.location.href = '/Login')
        }
    }
    mouseLeaveReport() {
        this.setState({ reportdropdown: false })
    }
    handleLogout() {
        //auth.logout()
        this.setState({ logout: true })
    }

    handleCollapse() {
        this.setState({ collapsed: !this.state.collapsed })
    }

    render() {
        let role = 'superadmin'
        let empEmail = ''
        let sysAdminMenuActive = false
        let sysAdminMenuActiveReport = false
        if (this.state.logout === true) {
            return <Redirect to='/Login' />
        }
        else if (auth.loggedIn()) {
            // role = auth.getProfile().role
            // role = role.toLowerCase()

            empEmail = localStorage.getItem('emp_email')
            if (empEmail === null || empEmail === 'null') {     // check null จาก localstorage คิดว่า returnเป็น string ดักไว้2case เลย 
                empEmail = ''   
            }
        }

        var path = window.location.pathname
        if (path != '/' && path != '/ActivityHistory' && path != '/ActivityApprove') {
            if (path != '/Report' && path != '/ReportbyProject') {
                sysAdminMenuActiveReport = true
            }
            else {
                sysAdminMenuActive = true
            }
        }

        return (
            <React.Fragment>

                <p color="danger" style={{ color: 'white', cursor: 'pointer', position: 'absolute', top: '0', right: '0', paddingRight: '3px' }} onClick={this.handleLogout}>{empEmail} Logout </p>
                <Row style={{ margin: '15px' }}>
                    <Col lg="4" md="3" sm="12">
                        <div style={{ padding: '10px' }}>
                            <img src={dtslabel} style={{ position: 'absolute', width: '175px', height: '135px', top: '-40px', left: '-30px' }} />
                        </div>

                    </Col>
                    <Col lg="7" md="12" sm="12">
                        <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white" style={{ padding: '5px', margin: '10px', whiteSpace: 'nowrap' }}>
                            <NavbarToggler onClick={this.handleCollapse} className="mr-2 navbar-dark" style={{ position: 'relative', left: '-42px', top: '10px', outline: 'none' }} />
                            <Collapse isOpen={this.state.collapsed} navbar>
                                <ul className="navbar-nav flex-grow tnav" style={{ width: '100%', textAlign: 'center' }}>

                                    <NavItem style={{ flex: 'auto', margin: '5px' }}>
                                        <NavLink className="tnav" exact to="/" >บันทึกกิจกรรม</NavLink>        {/*exact When true, the active class/style will only be applied if the location is matched exactly.*/}
                                    </NavItem>
                                    <NavItem style={{ flex: 'auto', margin: '5px' }}>
                                        <NavLink className="tnav" exact to="/ActivityHistory">ประวัติกิจกรรม</NavLink>
                                    </NavItem>

                                    {role === 'sm' || role === 'lead' || role === 'superadmin' ?
                                        <NavItem style={{ flex: 'auto', margin: '5px' }}>
                                            <NavLink className="tnav" exact to="/ActivityApprove">อนุมัติกิจกรรม</NavLink>
                                        </NavItem>
                                        : ''}

                                    {role === 'admin' || role === 'lead' || role === 'superadmin' || role === 'sm' ?
                                        <Dropdown style={{ color: 'white', flex: '1 1 auto', top: '-3px' }} nav isOpen={this.state.reportdropdown} toggle={this.togglereport} onMouseOver={this.mouseOverReport} onMouseLeave={this.mouseLeaveReport}>
                                            <DropdownToggle nav>
                                                <span className={sysAdminMenuActive === true ? 'tnav active' : ''}>รายงาน</span>
                                            </DropdownToggle>
                                            <DropdownMenu style={{ width: '100%', fontFamily: 'none', textAlign: 'center' }}>
                                                <LinkContainer to='/Report'>
                                                    <DropdownItem>รายงานรายเดือน</DropdownItem>
                                                </LinkContainer>
                                                <LinkContainer to='/ReportbyProject'>
                                                    <DropdownItem>รายงานรายโครงการ</DropdownItem>
                                                </LinkContainer>
                                            </DropdownMenu>
                                        </Dropdown>
                                        : ''}


                                    {/*<NavItem style={{ flex: 'auto', margin: '5px' }}>
                                        <NavLink className="tnav" exact to="/c">สำหรับดูแลระบบ</NavLink>
                                    </NavItem>*/}
                                    <Dropdown style={{ color: 'white', flex: '1 1 auto', top: '-3px' }} nav isOpen={this.state.admindropdown} toggle={this.toggle} onMouseOver={this.mouseOver} onMouseLeave={this.mouseLeave}>
                                        <DropdownToggle nav>
                                            <span className={sysAdminMenuActiveReport === true ? 'tnav active' : ''}>สำหรับดูแลระบบ</span>
                                        </DropdownToggle>

                                        <DropdownMenu style={{ width: '100%', fontFamily: 'none', textAlign: 'center' }}>
                                            {role === 'superadmin' || role === 'admin' || role === 'sm' ?
                                                <LinkContainer to='/Customer'>
                                                    <DropdownItem>ข้อมูลลูกค้า</DropdownItem>
                                                </LinkContainer>
                                                : ''}

                                            {role === 'superadmin' || role === 'admin' || role === 'sm' ?
                                                <LinkContainer to='/Employee'>
                                                    <DropdownItem>ข้อมูลพนักงาน</DropdownItem>
                                                </LinkContainer>
                                                : ''}

                                            {role === 'superadmin' || role === 'admin' || role === 'sm' || role === 'lead' ?
                                                <LinkContainer to='/Project'>
                                                    <DropdownItem>ข้อมูลระยะโครงการ</DropdownItem>
                                                </LinkContainer>
                                                : ''}


                                            {role === 'superadmin' || role === 'admin' ?
                                                <LinkContainer to='/Role'>
                                                    <DropdownItem>ข้อมูล Role</DropdownItem>
                                                </LinkContainer>
                                                : ''}

                                            <LinkContainer to='/PersonalProfile'>
                                                <DropdownItem>ข้อมูลส่วนตัว</DropdownItem>
                                            </LinkContainer>

                                            {role === 'superadmin' || role === 'admin' ?
                                                <LinkContainer to='/WorkingDays'>
                                                    <DropdownItem>ข้อมูลวันทำงาน</DropdownItem>
                                                </LinkContainer>
                                                : ''}

                                        </DropdownMenu>


                                    </Dropdown>
                                </ul>
                            </Collapse>
                        </Navbar>
                    </Col>
                </Row>
            </React.Fragment>
        )

    }
}
