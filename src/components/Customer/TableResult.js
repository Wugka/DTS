import React, { Component } from 'react'
import { Row, Col, Table, Modal } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import swal from 'sweetalert'
import axios from 'axios'
import AddEditCustomer from '../Customer/AddEditCustomer'
import AuthService from '../AuthService';
import PaginationDts from '../componentsReuse/PaginationDts'
import { Scrollbars } from 'react-custom-scrollbars'
import DetailModal from '../Customer/DetailModal'
var auth = new AuthService()

export default class TableResult extends Component {
    constructor() {
        super()
        this.state = { deleteId: -1, editId: -1, editClick: false, deleteClick: false, clickitem: [], showModal: true }
        this.handleDelete = this.handleDelete.bind(this)
        this.handleAddEditCustomer = this.handleAddEditCustomer.bind(this)
        this.handleModalClickDetail = this.handleModalClickDetail.bind(this)
        this.closeModal = this.closeModal.bind(this)
    }

    handleModalClickDetail(item) {
        this.setState(prevState => ({ showModalDetail: !prevState.showModalDetail, clickitem: item }))
    }

    handleAddEditCustomer(item, i) {
        this.setState(({ editClick: true, editId: i, clickitem: item, showModal: true }))
    }

    closeModal() {
        this.setState({ editClick: false, editId: -1 });
    }

    async handleDelete(item, i, cb) {



        this.setState({ deleteId: i })
        const webapiurl = await axios.get('api/ConfigFromAppSetting')

        swal({
            title: 'ยืนยันการลบข้อมูล',
            text: 'ชื่อลูกค้าที่ต้องการลบ : ' + item.cusName,
            buttons: {
                ok: 'ตกลง',
                cancel: 'ยกเลิก'
            }
        }).then((value) => {

            switch (value) {
                case 'ok':
                    auth.fetchWithToken(webapiurl.data + '/api/v1/Customers/' + item.cusId, { method: 'DELETE' })
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
                    break;

                default: this.setState({ deleteId: -1 })
            }
        })
    }


    render() {
        const CustomerArray = []

        this.props.CustomerArray ? this.props.CustomerArray.map((item, i) => {
            // console.log('item ' + JSON.stringify(item))
            //  console.log(' i ' + JSON.stringify(i))
            let selectedrow = 'white'
            if (this.state.deleteId == i || this.state.editId == i) {
                selectedrow = 'red'
            }

            CustomerArray.push(

                <tr key={i} style={{ color: selectedrow }}>
                    <td name='delete'>
                        {this.state.deleteId == i ? <FontAwesomeIcon onClick={() => this.handleDelete(item, i)} icon={['far', 'dot-circle']} size='lg' style={{ color: "red", cursor: 'pointer' }} />
                            : <FontAwesomeIcon onClick={() => this.handleDelete(item, i, this.props.fetchData)} icon={['far', 'circle']} size='lg' style={{ color: "red", cursor: 'pointer' }} />}
                    </td>
                    <td name='edit'>
                        {
                            this.state.editId == i ? <FontAwesomeIcon onClick={() => this.handleAddEditCustomer(item, i)} icon={['far', 'dot-circle']} size='lg' style={{ color: "red", cursor: 'pointer' }} />
                                : <FontAwesomeIcon onClick={() => this.handleAddEditCustomer(item, i)} icon={['far', 'circle']} size='lg' style={{ color: "red", cursor: 'pointer' }} />
                        }
                    </td>

                    <td onClick={() => this.handleModalClickDetail(item)} style={{ cursor: 'pointer', maxWidth: '230px' }}> <Scrollbars autoHeight> <p style={{ whiteSpace: 'pre-line', textAlign: 'center' }}> {item.cusId} </p> </Scrollbars></td>
                    <td style={{textAlign:'left'}}> {item.cusName}  </td>
                    <td style={{ textAlign: 'left' }}> {item.cusAddress} </td>
                    <td style={{ textAlign: 'left' }}> {item.cusPhone} </td>
                    {/*<td> {item.cusFax} </td>
                    <td> {item.cusWebsite} </td>*/}
                    
                    <td style={{ textAlign: 'left' }}> {item.cusContact} </td>
                    <td style={{ textAlign: 'left' }}> {item.cusContactEmail} </td>
                </tr>
            )
        })

            : ''
        // console.log('paging ' + JSON.stringify(this.props.paging))
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
                                        <th>รหัสลูกค้า</th>
                                        <th>ชื่อลูกค้า</th>
                                        <th>ที่อยู่ลูกค้า</th>
                                        <th>เบอร์โทรศัพท์</th>
                                        {/*<th>เบอร์แฟกซ์</th>
                                        <th>เว็บไซต์</th>*/} 
                                        <th>ชื่อผู้ติดต่อ</th>
                                        <th>อีเมล์ผู้ติดต่อ</th>
                                    </tr>
                                </thead>
                                <tbody style={{ textAlign: 'center' }}>
                                    {CustomerArray}
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

                    <AddEditCustomer
                        handleAddEditCustomer={this.handleAddEditCustomer}
                        fetchData={this.props.fetchData}
                        item={this.state.clickitem}
                        showModal={this.state.showModal}
                        closeModal={this.closeModal}
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