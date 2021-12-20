import React, { Component } from 'react'
import { Button } from 'reactstrap'


export default class WeekDays extends Component {
    constructor(props) {
        super(props)
        this.state = { dayArray: props.item, currentDay: props.currentDay, jsonalldata: props.jsonalldata, projectlist:[]} 
        this.GetDayList = this.GetDayList.bind(this)
        this.getDates = this.getDates.bind(this)
    }

    //************************************************************************************************************************************

    shouldComponentUpdate(nextState) {
        return nextState.dayArray != this.state.dayArray
    }

    componentWillReceiveProps(nextprops) {
        this.setState({ dayArray: nextprops.item, currentDay: nextprops.currentDay, jsonalldata: nextprops.jsonalldata })
    }

    //************************************************************************************************************************************

    chunkArray(arr) {
        var result = [];
        var index = 0;

        for (var i = 0; i < 6; i++) {
            result.push([])
            for (var j = 0; j < 7; j++) {
                result[i].push(arr[index])
                index++
            }
        }

        return result;              //[[1,2,3,4,5,6,6] , [7,8,9,10,11,12]
    }

    //************************************************************************************************************************************

    GetDayList() {
        const dayDataInList = this.chunkArray(this.state.dayArray)

        const now = new Date()
        let tdy = now.getDate()
        const lastmonthNowString = new Date(now.getFullYear(), now.getMonth(), 0)   //;วันสุดท้ายของเดือนที่แล้ว
        const nextmonthNowString = new Date(now.getFullYear(), now.getMonth() + 1, 1)      
        const lastmon = lastmonthNowString.getMonth()
        const nextmon = nextmonthNowString.getMonth()
        const tdyString = 'cm' + ('0' + tdy).slice(-2)

        let lastdayoflastmonth = lastmonthNowString.getDate() //วันสุดท้ายของเดือนที่แล้ว นับจากเวลาตอนนี้
        let availableDate = []
        var isCurrentMonth = true

        //หาวันกรอบเขียว ย้อนหลัง7 วัน
            availableDate.push(tdyString)
            for (let i = 1; i < 8; i++) {
                if (isCurrentMonth && tdy - 1 > 0) {
                    var temp = tdy - 1
                    tdy--
                    availableDate.push('cm' + ('0' + temp).slice(-2))
                }
                else {
                    isCurrentMonth = false
                    availableDate.push('lm' + ('0' + lastdayoflastmonth).slice(-2))
                    lastdayoflastmonth--
                }
        }
        if (this.props.currentMonth == now.getMonth() && this.props.currentYear == now.getFullYear()) {
            availableDate = availableDate
        }
        else if (this.props.currentMonth == lastmon && this.props.currentYear == lastmonthNowString.getFullYear()) {            //lm28,lm29,lm30,cm01,cm02,cm03
            var newAvaiableDate = []
            availableDate.map((item, index) => {
                var temp = ''
                if (item.slice(0, 2) == 'lm') {
                    temp = item.replace('lm', 'cm')
                }
                else if (item.slice(0, 2) == 'cm') {
                    temp = item.replace('cm', 'nm')
                }
                newAvaiableDate.push(temp)
            })
            availableDate = newAvaiableDate
        }
        else if (this.props.currentMonth == nextmon && this.props.currentYear == nextmonthNowString.getFullYear()) {
            var newAvaiableDate = []
            availableDate.map((item, index) => {
                var temp = ''
                if (item.slice(0, 2) == 'cm') {
                    temp = item.replace('cm', 'lm')
                }

                newAvaiableDate.push(temp)
            })
            availableDate = newAvaiableDate
        }
        else {
            availableDate = []
        }

        let dayArray = []
        let dataindex = this.state.dayIsSelected
        let curDay = 'cm' + ('0' + this.state.currentDay).slice(-2)
        let rangeArray = []
        rangeArray = this.getDates()

        for (let row = 0; row < 6; row++) {
            let rowArray = []
            for (let col = 0; col < 7; col++) {
                let temp = dayDataInList[row][col]; //01 02 ... 10 11

                if (row == 0 && dayDataInList[row][col] > 7) {          //แถวแรกมากกว่า 7 = lastmonth
                    dataindex = 'lm' + dayDataInList[row][col]
                }
                else if ((row == 5 || row == 4) && dayDataInList[row][col] < 15) {
                    dataindex = 'nm' + dayDataInList[row][col]
                }
                else {
                    dataindex = 'cm' + dayDataInList[row][col]  
                }
                
                let classString = ''
                if (availableDate.indexOf(dataindex) > -1) {
                    classString = 'available-day'
                }
                else {
                    classString = 'btnColor'
                }

                if (curDay == dataindex) {
                    classString = 'active-day'
                }

                let textcolor = ''
                if (rangeArray.length > 0) {
                    for (var i = 0; i < rangeArray.length; i++) {
                        var num = ('0' + rangeArray[i]).slice(-2) // 01 02

                        if (dataindex.slice(0, 2) == 'cm' && num == dayDataInList[row][col]) {
                            rangeArray.splice(i, 1)         // remove from Array
                            textcolor = 'redtext'
                            break
                        }
                    }
                }

                if (dataindex.slice(0, 2) == 'lm' || dataindex.slice(0, 2) == 'nm') {
                    textcolor = 'greytext'
                }

                rowArray.push(<td key={col}>
                    <Button style={{ fontWeight:'600' }} dayindex={dataindex} className={[classString, textcolor].join(" ")} name='currentDay' value={temp} onClick={this.props.onChangeDate} size="sm">{temp}</Button>
                             </td >)

            }
            dayArray.push(<tr key={row} datarow={row}>{rowArray}</tr>)
        }

        return dayArray;
        
    }

    //************************************************************************************************************************************

    //dayInRange(day) {
    //    const Moment = require('moment');
    //    const MomentRange = require('moment-range');
    //    const moment = MomentRange.extendMoment(Moment);
    //    var isFound = false;

    //this.state.jsondata.length ? this.state.jsondata.map((item, index) => {
    //    const startdate = new Date(item.dtsStartDate)
    //    const stopdate = new Date(item.dtsStopDate)
    //    const start = new Date(startdate.getFullYear(), startdate.getMonth(), startdate.getDate(), 0, 0, 0)
    //    const end = new Date(stopdate.getFullYear(), stopdate.getMonth(), stopdate.getDate(), 23, 59, 59)
    //    const range = moment.range(start, end)
    //    const dateToFind = new Date(this.state.currentYear, this.state.currentMonth, day, 0, 0, 0)

    //    isFound = range.contains(dateToFind)
    //    console.log('return')
    //    return isFound

    //    console.log('sd: ' + start + ' st: ' + end)
    //}) : ''

    //}

    //************************************************************************************************************************************

    getDates() {
        var dateArray = []
        let backToArray = []
        this.state.jsonalldata.length ? this.state.jsonalldata.map((item, index) => {
            const datetimestring = item.dtsStartDate.split('T')  // 2020-02-03T08:30:00
            const eventdate = datetimestring[0].split('-')
            const haseventday = eventdate[2]

            //let startdate = new Date(item.dtsStartDate)
            ////const stopdate = new Date(item.dtsStopDate)
            //let start = new Date(startdate.getFullYear(), startdate.getMonth(), startdate.getDate(), 0, 0, 0)
            //const end = new Date(stopdate.getFullYear(), stopdate.getMonth(), stopdate.getDate(), 23, 59, 59)

            dateArray.push(haseventday);                // เอาแค่ datestart สีแดง

            //while (start <= end) {                                    เอาทั้ง start และ stop ที่อยู่ในช่วงเดิอนไปโช สีแดง
            //    dateArray.push((new Date(start)).getDate());
            //    var temp = new Date(start)
            //    start = temp.setDate(temp.getDate() + 1)
            //}

        }) : ''

        const uniqueSet = new Set(dateArray)
        backToArray = [...uniqueSet]

        return backToArray

    }


    //************************************************************************************************************************************

    render() {
        return (
            <React.Fragment>
                <this.GetDayList /> 
            </React.Fragment>
        )
    }

    //************************************************************************************************************************************

}