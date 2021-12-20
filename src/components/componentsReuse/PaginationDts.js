import React, { Component } from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import '../../css/PaginationDts.css'
import PaginationJS from "react-js-pagination"


export default class PaginationDts extends Component {
    constructor() {
        super()
    }

    render() {
        
        //let paginationArray = []
        let currentpage = this.props.currentPage

        //let totalpage = this.props.paging.totalPages
        //if (this.props.paging.totalPages >= 2) {
        //    for (let i = 1; i <= totalpage; i++) {
        //        paginationArray.push(
        //            <PaginationItem active={i === currentpage} key={i}>
        //                <PaginationLink onClick={() => this.props.handlePagination(i)}>
        //                    {i}
        //                </PaginationLink>
        //            </PaginationItem>
        //        )
        //    }
        //}
       
        return (
            this.props.paging.totalPages >= 2 ?
                <Pagination size='sm' className='blackstylepagination' style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {/*<PaginationItem disabled={currentpage === 1}>
                        <PaginationLink name='prev' onClick={() =>this.props.handlePagination(currentpage - 1)}>
                            Prev
                        </PaginationLink>
                    </PaginationItem>*/}
                    
                    <PaginationJS
                        activePage={currentpage}
                        itemsCountPerPage={10}
                        totalItemsCount={this.props.paging.totalItems}
                        pageRangeDisplayed={5}
                        onChange={(e) => this.props.handlePagination(e)}
                        itemClass='page-item'
                        linkClass='page-link'
                        prevPageText='<'
                        nextPageText='>'
                        firstPageText='<<'
                        lastPageText='>>'
                        hideDisabled
                    />

                    {/*<PaginationItem disabled={currentpage === totalpage}>
                        <PaginationLink  name='next' onClick={() => this.props.handlePagination(currentpage + 1)}>
                            Next
                        </PaginationLink>
                    </PaginationItem>*/}
                </Pagination>

                : ''
        )
       

    }


}
    
    


