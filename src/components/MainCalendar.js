import React, { Component } from "react";
import "../css/MainCalendar.css"
import { Button, ButtonGroup } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CalendarMonths from '../components/CalendarMonths'
import monthData from '../monthData'
import dayData from '../dayData'
import WeekDays from "./WeekDays";
import { Table } from 'reactstrap';
import { Row, Col } from 'reactstrap';

export default class MainCalendar extends Component {

    constructor(props) {
        super(props)

        this.state = { dayArray: props.dayArray, monthArray: monthData, currentMonth: props.currentMonth, currentYear: props.currentYear }
        this.calcDay = this.calcDay.bind(this)
    }

    //****************************************************************************************************************************************

    componentWillMount() {
        const dayArray = this.calcDay()
        this.setState({ dayArray: dayArray })
    }

     //****************************************************************************************************************************************

    componentWillReceiveProps(nextProps) {
            const dayArray = this.calcDay(nextProps.currentMonth)
            this.setState({ currentMonth: nextProps.currentMonth, currentYear: nextProps.currentYear, dayArray: dayArray })
    }

    //****************************************************************************************************************************************

    calcDay(monthid = this.state.currentMonth) {
        var curmonth = parseInt(monthid) + 1
        var lastdayoflastmonthString = new Date(this.state.currentYear, monthid, 0)
        var lastdayofcurrentmonth = new Date(this.state.currentYear, curmonth, 0)
        var lastdayoflastmonth = lastdayoflastmonthString.getDate()               //30        Sat Nov 30
        var lastweekdayoflastmonth = lastdayoflastmonthString.getDay()          //  5 (Sat)
        var day_array = []
        var now = new Date()

        //dayData.map(x => {
        //    if (x.sday === lastweekdayoflastmonth) {
        //        indexOfLastmonthWeekday = x.index
        //    }
        //})

        var startday = parseInt(lastdayoflastmonth) - parseInt(lastweekdayoflastmonth) // 30 - 6       //วัน ตำแหน่งที่1ที่ต้องโชใน Maincalendar 
        
        var lastMonthdayExist = true
        if (lastweekdayoflastmonth == 6) {             //ถ้าวันสุดท้ายของเดือนที่แล้วเป็น SAT วันเริ่มต้นเป็นวันที่1 เพราะMain Calenเริ่มจาก SUN   ไม่งั้นจะมีวันสีเทาของเดือนที่่แล้วเต็มๆ1บรรทัด                             
            startday = 1
            lastMonthdayExist = false;
        }
        //for (var i = 0; i < 42; i++) {
        //    if (startday > parseInt(lastdayoflastmonth)) {    //ถ้าวันตอนนี้มากกว่าวันสุดท้ายของเดือนที่แล้ว เริ่ม 1      สีเทาเดือนที่แล้วจนถึงวันแรกเดือนนี้      พอเริ่ม1ต้องรันถึงวันสุดท้ายของเดือนนี้ แล้ว เริ่ม1ใหม่+วันที่เหลือ
        //        startday = 1;
        //    }
        //    day_array.push(("0" + startday).slice(-2));
        //    startday++;
        //}

        var counter = 0
        if (lastMonthdayExist) {                                                                //ถ้ามีวันของเดือนที่แล้วในMain calendar >> เทียบวันเริ่มถึงวันสุดท้ายของเดือนที่แล้ว add ลง Array
            while (startday <= parseInt(lastdayoflastmonth)) {
                day_array.push(("0" + startday).slice(-2))
                startday++
                counter++
            }
        }

        startday = 1;

        while (startday <= parseInt(lastdayofcurrentmonth.getDate())) {                     //คำนวณวันที่1ถึงวันสุดท้ายของเดือนปัจจุบัน push ลงArray
            day_array.push(("0" + startday).slice(-2))
            startday++
            counter++
        }

        startday = 1
        var remainingNextMonthDay = 42 - counter                                    //จำนวณของวันที่เหลือของเดือนถถัดไป

        for (var i = 0; i < remainingNextMonthDay; i++) {                           // คำนวณวันที่เหลือของเดือนถัดไป push ลง Array
            day_array.push(("0" + startday).slice(-2))
            startday++
        }
        
        var curmonth = monthid
        var thisday = now.getDate();

        if (monthid != curmonth) {
            startday = ''
        }
        else {
            startday = thisday;
        }

        return day_array

    }

    //*********************************************************************************************************************************

    render() {
        const month_Array = this.state.monthArray.map((item, key) =>
            <CalendarMonths key={key} item={item} name="currentMonth" onChangeMonth={this.props.onChangeMonth} monthIsSelected={this.props.currentMonth} /> 
        );

        return (
            <div>
                <div style={{ textAlign: "right" }}>
                    <Button className='btnColor' size='sm' value={this.props.currentYear} name='currentYearPrev' onClick={(event) => this.props.onYearChange(event)}> <FontAwesomeIcon icon={['fas', 'chevron-left']} className="triangle-left" style={{ cursor: 'pointer' }} /> </Button>
                    <p className="year">{this.props.currentYear}</p>
                    <Button className='btnColor' size='sm' value={this.props.currentYear} name='currentYearNext' onClick={(event) => this.props.onYearChange(event)}> <FontAwesomeIcon icon={['fas', 'chevron-right']} className="triangle-right" style={{ cursor: 'pointer' }} /> </Button>
                </div>
                {/*<ButtonGroup style={{ width: '100%' }} curmonth={this.props.currentMonth}>
                    {month_Array}
                </ButtonGroup>     */}
                <Row>
                    <Col lg="12" md="12" sm="12" xs="12">
                        <div style={{ display: 'flex', overflow:'auto' }}>
                            {month_Array}
                        </div>
                        
                    </Col>

                </Row>
                <hr className="month-line" />

                <Table responsive className="removeborderth">
                    <thead>
                        <tr style={{ color: 'white', textAlign:'center' }}>
                            <th>SUN</th>
                            <th>MON</th>
                            <th>TUE</th>
                            <th>WED</th>
                            <th>THU</th>
                            <th>FRI</th>
                            <th>SAT</th>
                        </tr>
                    </thead>
                    <tbody style={{ textAlign: 'center' }}>
                        <WeekDays item={this.state.dayArray} onChangeDate={this.props.onChangeDate} currentDay={this.props.currentDay} jsonalldata={this.props.jsonalldata} currentYear={this.state.currentYear} currentMonth={this.state.currentMonth} />
                    </tbody>
                </Table>

            </div>
        );

    }

    //*********************************************************************************************************************************

}
