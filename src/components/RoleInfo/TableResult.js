import React, { Component } from 'react'
import { Row, Col, Table, Modal } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import swal from 'sweetalert'
import axios from 'axios'
import AddEditRole from '../componentsReuse/AddEditRole'
import AuthService from '../AuthService';
import PaginationDts from '../componentsReuse/PaginationDts'

var auth = new AuthService()

export default class TableResult extends Component {
    constructor() {
        super()
        this.state = { deleteId: -1, editId: -1, editClick:false, deleteClick:false,clickitem:[] }
        this.handleDelete = this.handleDelete.bind(this)
        this.handleAddEditRole = this.handleAddEditRole.bind(this)
        this.closeModal = this.closeModal.bind(this)
    }

    //*******************************************************************************************************************************************************************************

    handleAddEditRole(item, i) {
        this.setState(prevState => ({ editClick: !prevState.editClick, editId:i,clickitem:item }))
    }

    closeModal() {
        this.setState({ editClick: false, editId: -1 })
    }

    //*******************************************************************************************************************************************************************************

    async handleDelete(item,i,cb) {
        this.setState({ deleteId: i })
        const webapiurl = await axios.get('api/ConfigFromAppSetting')

        swal({
            title: 'ยืนยันการลบข้อมูล',
            text: item.roleName + ': ' + item.roleShortName,
            buttons: {
                ok: 'ตกลง',
                cancel: 'ยกเลิก'
            }
        }).then((value) => {

            switch (value) {
                case 'ok':

                    auth.fetchWithToken(webapiurl.data + '/api/v1/Roles/' + item.roleId, { method: 'DELETE' })
                        .then(response => {
                            if (auth._IsSuccessResponse(response)) {
                                swal({ text: 'ลบข้อมูลสำเร็จ', icon: 'success' })
                                this.setState({deleteId:-1})
                                cb()
                            }
                            
                        })
                        .catch(err => {
                            swal({ text: 'ไม่สามารถลบข้อมูลได้', icon: 'warning' })
                            this.setState({ deleteId: -1 })
                        })
                    break;

                default: this.setState({ deleteId: -1 })
            }
        })
    }

    //*******************************************************************************************************************************************************************************

    render() {
        const roleArray = []

        this.props.roleArray.length ? this.props.roleArray.map((item, i) => {

            let selectedrow = 'white'
            if (this.state.deleteId == i || this.state.editId == i) {
                selectedrow = 'red'
            }

            roleArray.push(
                <tr key={i} style={{ color: selectedrow }}>
                    <td name='delete'>
                        {this.state.deleteId == i ? <FontAwesomeIcon onClick={() => this.handleDelete(item,i,this.props.fetchData)} icon={['far', 'dot-circle']} size='lg' style={{ color: "red", cursor: 'pointer' }} />
                            : <FontAwesomeIcon onClick={() => this.handleDelete(item,i,this.props.fetchData)} icon={['far', 'circle']} size='lg' style={{ color: "red", cursor: 'pointer' }} />}
                    </td>
                    <td name='edit'>
                        {this.state.editId == i ? <FontAwesomeIcon onClick={() => this.handleAddEditRole(item, i)} icon={['far', 'dot-circle']} size='lg' style={{ color: "red", cursor: 'pointer' }} />
                                : <FontAwesomeIcon onClick={() => this.handleAddEditRole(item, i)} icon={['far', 'circle']} size='lg' style={{ color: "red", cursor: 'pointer' }} />
                        }
                    </td>
                    <td> {item.roleId} </td>
                    <td style={{ textAlign:'left' }}> {item.roleName}  </td>
                    <td> {item.roleShortName} </td>
                </tr>
            )
        })
            : roleArray.push(<tr key={1}><td colSpan='10' style={{ textAlign: 'center', color: 'white' }}>ไม่พบข้อมูล</td></tr>)

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
                                    <th>รหัส Role</th>
                                    <th>ชื่อเต็มของ Role</th>
                                    <th>ชื่อย่อของRole</th>
                                </tr>
                            </thead>
                            <tbody style={{ textAlign: 'center' }}>
                                {roleArray}
                            </tbody>
                            </Table>
                        </div>
                    </Col>
                </Row>

                {this.state.editClick &&
                    <AddEditRole
                    handleAddEditRole={this.handleAddEditRole}
                    item={this.state.clickitem}
                    showModal={this.state.editClick}
                    closeModal={this.closeModal}
                    fetchData={this.props.fetchData}
                    maxRoleId={this.props.maxRoleId}
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