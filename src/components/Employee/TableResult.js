import React, { Component } from 'react'
import { Row, Col, Table, Modal } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import swal from 'sweetalert'
import AuthService from '../AuthService';
import axios from 'axios'
import AddEditEmployee from '../Employee/AddEditEmployee'
import PaginationDts from '../componentsReuse/PaginationDts'
import { Scrollbars } from 'react-custom-scrollbars'
import DetailModal from '../Employee/DetailModal'
import { config } from '@fortawesome/fontawesome-svg-core';

var auth = new AuthService()

export default class TableResult extends Component {
    constructor() {
        super()
        const profile = auth.getProfile()
        const empsid = profile.nameid
        this.state = { empsid: empsid, deleteId: -1, editId: -1, editClick: false, deleteClick: false, clickitem: [], showModal: true, EmployeesHeadsArray: [], ishead: false, isheademp: false, empid: 0 }
        this.handleDelete = this.handleDelete.bind(this)
        this.handleAddEditEmployee = this.handleAddEditEmployee.bind(this)
        this.handleModalClickDetail = this.handleModalClickDetail.bind(this)
        this.handleisHeadEmpResult = this.handleisHeadEmpResult.bind(this)
        this.closeModal = this.closeModal.bind(this)
        this.fetchData = this.fetchData.bind(this)
    }

    handleModalClickDetail(item) {
        this.setState(prevState => ({ showModalDetail: !prevState.showModalDetail, clickitem: item }))
    }
    handleisHeadEmpResult() {
        this.setState({ ishead: !this.state.ishead })
    }
    async fetchData() {
        //  console.log('empid ' + this.state.empid)
        const webapiurl = await axios.get('api/ConfigFromAppSetting')
        Promise.all([
            auth.fetchWithToken(webapiurl.data + '/api/v1/EmployeesHeads/' + this.state.empid, "method:'GET'"),
        ])
            .then(([EmployeesHeads]) => this.setState({
                EmployeesHeadsArray: EmployeesHeads.data,
            }, () => this.state.EmployeesHeadsArray === "" ? this.setState({ ishead: false }) : this.setState({ ishead: true }))
            )
            .catch(error => console.log(error));

        //console.log('EmployeesHeadsArray ' + JSON.stringify(this.state.EmployeesHeadsArray))
    }
    handleAddEditEmployee(item, i) {

        // console.log('item handeladdeditemp tableresult ' + JSON.stringify(item))
        this.setState({ empid: item.empId }, () => {
            this.fetchData()

        })


        this.setState(({ editClick: true, editId: i, clickitem: item, showModal: true }))
    }

    closeModal() {
        this.setState({ editClick: false, editId: -1 });
    }


    async handleDelete(item, i, cb) {

        console.log(JSON.stringify(item))
        console.log('empid ' + this.state.empsid)
        this.setState({ deleteId: i })
        const webapiurl = await axios.get('api/ConfigFromAppSetting')
        
        swal({
            title: 'ยืนยันการลบข้อมูล',
            text: 'ชื่อพนักงานที่ต้องการลบ : ' + item.empName,
            buttons: {
                ok: 'ตกลง',
                cancel: 'ยกเลิก'
            }
        }).then((value) => {
           
            switch (value) {
                case 'ok':
                    if (this.state.empsid == item.empId) {
                        swal({ text: 'ไม่สามารถลบข้อมูลตัวเองได้', icon: 'warning' })
                        this.setState({ deleteId: -1 })
                    } else {
                        auth.fetchWithToken(webapiurl.data + '/api/v1/Employees/' + item.empId, { method: 'DELETE' })
                            .then(response => {
                                if (auth._IsSuccessResponse(response)) {
                                    swal({ text: 'ลบข้อมูลสำเร็จ', icon: 'success' })
                                    this.setState({ deleteId: -1 })
                                    cb()
                                }

                            })
                            .catch(err => {
                                swal({ text: 'ไม่สามารถลบข้อมูลได้', icon: 'warning' })
                                this.setState({ deleteId: -1 })
                            })
                    }
                 
                    break;

                default: this.setState({ deleteId: -1 })
            }
        })
    }
    render() {
        const EmployeeArray = []

        this.props.EmployeeArray ? this.props.EmployeeArray.map((item, i) => {
            //      console.log('item ' + JSON.stringify(item))
            //  console.log(' i ' + JSON.stringify(i))
            let selectedrow = 'white'
            if (this.state.deleteId == i || this.state.editId == i) {
                selectedrow = 'red'
            }

            EmployeeArray.push(

                <tr key={i} style={{ color: selectedrow }}>
                    <td name='delete'>
                        {this.state.deleteId == i ? <FontAwesomeIcon onClick={() => this.handleDelete(item, i)} icon={['far', 'dot-circle']} size='lg' style={{ color: "red", cursor: 'pointer' }} />
                            : <FontAwesomeIcon onClick={() => this.handleDelete(item, i, this.props.fetchData)} icon={['far', 'circle']} size='lg' style={{ color: "red", cursor: 'pointer' }} />}
                    </td>
                    <td name='edit'>
                        {
                            this.state.editId == i ? <FontAwesomeIcon onClick={() => this.handleAddEditEmployee(item, i)} icon={['far', 'dot-circle']} size='lg' style={{ color: "red", cursor: 'pointer' }} />
                                : <FontAwesomeIcon onClick={() => this.handleAddEditEmployee(item, i)} icon={['far', 'circle']} size='lg' style={{ color: "red", cursor: 'pointer' }} />
                        }
                    </td>

                    <td onClick={() => this.handleModalClickDetail(item)} style={{ cursor: 'pointer', maxWidth: '230px' }}> <Scrollbars autoHeight> <p style={{ whiteSpace: 'pre-line', textAlign: 'center' }}> {item.empCode} </p> </Scrollbars></td>
                    <td style={{ textAlign: 'left' }}>{item.empName}</td>
                    <td style={{ textAlign: 'left' }}>{item.missionEmployees.position.posName}</td>
                    <td style={{ textAlign: 'left' }}>{item.missionEmployees.department.depName}</td>
                    <td style={{ textAlign: 'left' }}>{item.missionEmployees.devision.divName}</td>
                    <td style={{ textAlign: 'left' }}>{item.missionEmployees.section.secName}</td>

                    <td style={{ textAlign: 'left' }}>{item.missionEmployees.employeesHead == null ? "" : item.missionEmployees.employeesHead.empHeadName}</td>
                    <td style={{ textAlign: 'left' }}>{item.empInphone}</td>
                    <td style={{ textAlign: 'left' }}>{item.empMobile}</td>
                    <td style={{ textAlign: 'left' }}>{item.empEmail}</td>
                </tr>
            )
        })

            : ''
        // console.log('paging ' + JSON.stringify(this.props.paging))
        //  console.log(this.state.ishead)
        return (

            <React.Fragment>

                <Row>
                    <Col lg={{ size: '12' }}>
                        <div className='faltutable'>
                            <Table bordered className='tableresult' >
                                <thead>
                                    <tr style={{ color: 'white', textAlign: 'center', backgroundColor: '#1F3358', whiteSpace: 'nowrap' }}>
                                        <th>ลบ</th>
                                        <th>แก้ไข</th>
                                        <th>รหัสพนักงาน</th>
                                        <th>ชื่อพนักงาน</th>
                                        <th>ตำแหน่ง</th>
                                        <th>ฝ่าย</th>
                                        <th>แผนก</th>
                                        <th>กลุ่มงาน</th>
                                        <th>หัวหน้างาน</th>
                                        <th>เบอร์ภายใน</th>
                                        <th>เบอร์มือถือ</th>
                                        <th>อีเมล์</th>
                                    </tr>
                                </thead>
                                <tbody style={{ textAlign: 'center' }}>
                                    {EmployeeArray}
                                </tbody>
                            </Table>
                        </div>
                    </Col>
                </Row>
                <Modal contentClassName='reviewdocmodal' isOpen={this.state.showModalDetail} toggle={this.handleModalClickDetail}>
                    {this.state.showModalDetail && <DetailModal click={this.handleModalClickDetail}
                        item={this.state.clickitem}
                    />}
                </Modal>
                {this.state.editClick &&

                    <AddEditEmployee
                        handleAddEditEmployee={this.handleAddEditEmployee}
                        fetchData={this.props.fetchData}
                        item={this.state.clickitem}
                        showModal={this.state.showModal}
                        closeModal={this.closeModal}
                        PositionsArray={this.props.PositionsArray}
                        DepartmentsArray={this.props.DepartmentsArray}
                        DevisionsArray={this.props.DevisionsArray}
                        SectionsArray={this.props.SectionsArray}
                        EmployeesHeadsArray={this.props.EmployeesHeadsArray}
                        GroupUsersArray={this.props.GroupUsersArray}
                        handleisHeadEmp={this.props.handleisHeadEmp}
                        handleisHeadEmpResult={this.handleisHeadEmpResult}
                        ishead={this.state.ishead}
                        //  isHeadEmp={this.props.isHeadEmp}
                        // isHeadEmp={this.state.ishead}
                        name='edit'
                    />
                }

                <PaginationDts handlePagination={this.props.handlePagination}
                    paging={this.props.paging}
                    currentPage={this.props.currentPage}
                />


            </React.Fragment>
        )
    }
}