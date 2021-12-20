import React, { Component } from 'react'
import { Row, Col, Table, Modal } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import swal from 'sweetalert'
import axios from 'axios'
import AddEditProject from './AddEditProject'
import AuthService from '../AuthService';
import PaginationDts from '../componentsReuse/PaginationDts'

var auth = new AuthService()

export default class TableResult extends Component {
    constructor() {
        super()
        this.state = { deleteId: -1, editId: -1, editClick: false, deleteClick: false, clickitem: [] }
        this.handleDelete = this.handleDelete.bind(this)
        this.handleAddEditProject = this.handleAddEditProject.bind(this)
        this.closeModal = this.closeModal.bind(this)
    }

    //*******************************************************************************************************************************************************************************

    handleAddEditProject(item, i) {
        this.setState(prevState => ({ editClick: !prevState.editClick, editId: i, clickitem: item }))
    }

    closeModal() {
        this.setState({ editClick: false, editId: -1 })
    }

    //*******************************************************************************************************************************************************************************

    async handleDelete(item, i, fetchdata) {
        this.setState({ deleteId: i })
        const webapiurl = await axios.get('api/ConfigFromAppSetting')

        swal({
            title: item.projFag === '1' ? 'ท่านต้องการเปิดโครงการ ใช่หรือไม่' : 'ท่านต้องการปิดโครงการ ใช่หรือไม่',
            text: item.projCode + ': ' + item.projName,
            buttons: {
                ok: 'ตกลง',
                cancel: 'ยกเลิก'
            }
        }).then((value) => {

            switch (value) {
                case 'ok':

                    auth.fetchWithToken(webapiurl.data + '/api/v1/Projects/' + item.projId, { method: 'DELETE' })
                        .then(response => {
                            if (auth._IsSuccessResponse(response)) {
                                swal({ text: item.projFag === '1' ? 'เปิดโครงการสำเร็จ' : 'ปิดโครงการสำเร็จ', icon: 'success' })
                                this.setState({ deleteId: -1 })
                                fetchdata()
                            }

                        })
                        .catch(err => {
                            swal({ text: 'ไม่สามารถเปิด ปิด โครงการได้', icon: 'warning' })
                            this.setState({ deleteId: -1 })
                        })
                    break;

                default: this.setState({ deleteId: -1 })
            }
        })
    }

    //*******************************************************************************************************************************************************************************

    render() {
        const projectArray = []
        const role = auth.getProfile().role

        this.props.projectArray.length ? this.props.projectArray.map((item, i) => {
            let selectedrow = 'white'
            if (this.state.deleteId == i || this.state.editId == i) {
                selectedrow = 'red'
            }

            projectArray.push(
                <tr key={i} style={{ color: selectedrow }}>
                    {role.toLowerCase() === 'lead' ? null : 
                        <td name='delete'>
                        {this.state.deleteId == i ?
                            item.projFag === '0' ?
                                <FontAwesomeIcon onClick={() => this.handleDelete(item, i, this.props.fetchData)} icon={['far', 'dot-circle']} size='lg' style={{ color: "red", cursor: 'pointer' }} />
                                : <FontAwesomeIcon onClick={() => this.handleDelete(item, i, this.props.fetchData)} icon={['far', 'circle']} size='lg' style={{ color: "red", cursor: 'pointer' }} />
                        :
                            item.projFag === '0' ?
                                <FontAwesomeIcon onClick={() => this.handleDelete(item, i, this.props.fetchData)} icon={['far', 'circle']} size='lg' style={{ color: "red", cursor: 'pointer' }} />
                                :
                                <FontAwesomeIcon onClick={() => this.handleDelete(item, i, this.props.fetchData)} icon={['far', 'dot-circle']} size='lg' style={{ color: "red", cursor: 'pointer' }} />
                        }

                        {/*{item.projFag === '1' ? <FontAwesomeIcon onClick={() => this.handleDelete(item, i, this.props.fetchData)} icon={['far', 'dot-circle']} size='lg' style={{ color: "red", cursor: 'pointer' }} />
                            : <FontAwesomeIcon onClick={() => this.handleDelete(item, i, this.props.fetchData)} icon={['far', 'circle']} size='lg' style={{ color: "red", cursor: 'pointer' }} />
                        }*/}
                    </td>    
                    }
                    
                    <td name='edit'>
                        {this.state.editId == i ? <FontAwesomeIcon onClick={() => this.handleAddEditProject(item, i)} icon={['far', 'dot-circle']} size='lg' style={{ color: "red", cursor: 'pointer' }} />
                            : <FontAwesomeIcon onClick={() => this.handleAddEditProject(item, i)} icon={['far', 'circle']} size='lg' style={{ color: "red", cursor: 'pointer' }} />
                        }
                    </td>
                    <td> {item.projCode} </td>
                    <td> {item.projectStatus ? item.projectStatus.projStatusName : ''}  </td>
                    <td style={{ textAlign:'left' }}> {item.projName}  </td>
                    <td> {item.projShortName} </td>
                </tr>
            )
        })
            : projectArray.push(<tr key={1}><td colSpan='10' style={{ textAlign: 'center', color: 'white' }}>ไม่พบข้อมูล</td></tr>)

        return (
            <React.Fragment>
                <Row>
                    <Col lg={{ size: '12' }}>
                        <div className='faltutable'>
                            <Table bordered className='tableresult' >
                                <thead>
                                    <tr style={{ color: 'white', textAlign: 'center', backgroundColor: '#1F3358', whiteSpace: 'nowrap' }}>
                                        {role.toLowerCase() === 'lead' ? null : <th>ปรับสถานะ</th>}
                                        <th>แก้ไข</th>
                                        <th>รหัสโครงการ</th>
                                        <th>สถานะโครงการ</th>
                                        <th>ชื่อโครงการ</th>
                                        <th>ชื่อย่อโครงการ</th>
                                    </tr>
                                </thead>
                                <tbody style={{ textAlign: 'center' }}>
                                    {projectArray}
                                </tbody>
                            </Table>
                        </div>
                    </Col>
                </Row>

                {this.state.editClick &&
                    <AddEditProject
                        handleAddEditProject={this.handleAddEditProject}
                        item={this.state.clickitem}
                        showModal={this.state.editClick}
                        closeModal={this.closeModal}
                        fetchData={this.props.fetchData}
                        maxProjectId={this.props.maxRoleId}
                        name='edit'
                        projectStatusArray={this.props.projectStatusArray}
                        projectTypeArray={this.props.projectTypeArray}
                        projectWorkArray={this.props.projectWorkArray}
                        customerArray={this.props.customerArray}
                        roleArray={this.props.roleArray}
                        employeeArray={this.props.employeeArray}
                        projectGroupArray={this.props.projectGroupArray}
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