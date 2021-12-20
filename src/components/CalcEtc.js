import React, { Component } from 'react'
import moment from 'moment'

export default class CaclEtc extends Component {
    constructor() {
        super()

        this.calcTotalHour = this.calcTotalHour.bind(this)
        this.getLunchLockStatus = this.getLunchLockStatus.bind(this)
    }

    //******************************************************************************************************************************************************************

    calcTotalHour(DataInDateStart, dataInDateStop, lunchstatus) {
        const startDate = moment(DataInDateStart)
        const stopDate = moment(dataInDateStop)

        const timeStartTemp = DataInDateStart.getHours() + ':' + ('0' + DataInDateStart.getMinutes()).slice(-2)
        const timeStopTemp = dataInDateStop.getHours() + ':' + ('0' + dataInDateStop.getMinutes()).slice(-2)
        var startTime = moment(timeStartTemp, 'hh:mm')
        var stopTime = moment(timeStopTemp, 'hh:mm')
        var startLunchTime = moment('12:00', 'hh:mm')
        var stopLunchTime = moment('13:00', 'hh:mm')
        let totalMs = 0

        if (moment(stopDate).isBefore(startDate)) {
            return totalMs = 0
        }

        if (lunchstatus == 1) 
        {
            if (DataInDateStart.getDate() === dataInDateStop.getDate()) {
                if (startTime.isBetween(startLunchTime, stopLunchTime, null, '[]') && stopTime.isBetween(startLunchTime, stopLunchTime, null, '[]')) {      // 12:00 <= start,stop < 13:00      Note: '[]' inclusive  start stop อยู่ในช่วงเที่ยง
                    totalMs = 0
                }
                else if (startTime.isBefore(startLunchTime) && stopTime.isBetween(startLunchTime, stopLunchTime, null, '[]')) {    // start < 12:00 && 12:00 <= stop < 13:00   startก่อนเที่ยง stop ช่วงเที่ยง  
                     //totalHrs = (moment.duration(startLunchTime.diff(startTime))).asHours()
                    totalMs = startLunchTime.diff(startTime)
                }
                else if (startTime.isBetween(startLunchTime, stopLunchTime, null, '[]') && (stopTime.isAfter(stopLunchTime))) {   // 12:00 <= start < 13:00 && stop > 13:00    startช่วงเที่ยง stop หลังบ่าย
                    //totalHrs = (moment.duration(stopTime.diff(stopLunchTime))).asHours()
                    totalMs = stopTime.diff(stopLunchTime)
                }
                else if (startTime.isBefore(startLunchTime) && stopTime.isAfter(stopLunchTime)) {   // start < 12:00    && stop > 13:00         start ก่อนเที่ยง  stop หลังบ่าย
                    //totalHrs = ((moment.duration(stopTime.diff(startTime))).asHours()) - 1
                    totalMs = stopTime.diff(startTime) - 3600000 // -1hr milliseconds
                }
                
                else {                                                                              // start ก่อนเที่ยง stop ก่อนเที่ยง && start หลังเที่ยง stop หลังเที่ยง คำนวนปกติ           
                    //totalHrs = (moment.duration(stopTime.diff(startTime))).asHours()    
                    totalMs = stopTime.diff(startTime)
                }
            } else if (DataInDateStart.getDate() !== dataInDateStop.getDate()) {       //ข้ามวัน คำนวนปกติ ไม่ - 1hr ถึงแม้ว่าจะมี lunch break
                let startDateStartLunchTime = new Date(DataInDateStart.getFullYear(), DataInDateStart.getMonth(), DataInDateStart.getDate(), 12, 0)
                let startDateEndLunchTime = new Date(DataInDateStart.getFullYear(), DataInDateStart.getMonth(), DataInDateStart.getDate(), 13, 0)
                let nextDateStartLunchTime = new Date(dataInDateStop.getFullYear(), dataInDateStop.getMonth(), dataInDateStop.getDate(), 12, 0)
                let nextDateEndLunchTime = new Date(dataInDateStop.getFullYear(), dataInDateStop.getMonth(), dataInDateStop.getDate(), 13, 0)

                startDateStartLunchTime = moment(startDateStartLunchTime)
                startDateEndLunchTime = moment(startDateEndLunchTime)
                nextDateStartLunchTime = moment(nextDateStartLunchTime)
                nextDateEndLunchTime = moment(nextDateEndLunchTime)

                if (startDate.isBetween(startDateStartLunchTime, startDateEndLunchTime, null, '[]') && stopDate.isBefore(nextDateStartLunchTime)) {
                    totalMs = stopDate.diff(startDateEndLunchTime)
                }
                else if (startDate.isAfter(startDateEndLunchTime) && stopDate.isBetween(nextDateStartLunchTime, nextDateEndLunchTime, null, '[]')) {
                    totalMs = nextDateStartLunchTime.diff(startDate)
                }
                else {
                    totalMs = stopDate.diff(startDate) - 3600000
                }

            }
        }                                                                                                                          
        else {                                                                                    //ไม่พักเที่ยง คำนวนปกติ
            //totalHrs = (Math.abs(endDate - startDate) / 36e5)
            totalMs = stopDate.diff(startDate)
        }

        if (totalMs < 0) 
        {
            return totalMs = 0
        }

        return totalMs //return เป็น milliseconds

    }

    //******************************************************************************************************************************************************************

    getLunchLockStatus(dataInStartDate, dataInStopdate) {
        //console.log('lockstatusFunc:' + dataInStartDate)
        let lunchlock = true

        let startDateStartLunchTime = new Date(dataInStartDate.getFullYear(), dataInStartDate.getMonth(), dataInStartDate.getDate(), 12, 0)
        let startDateEndLunchTime = new Date(dataInStartDate.getFullYear(), dataInStartDate.getMonth(), dataInStartDate.getDate(), 13, 0)
        let nextDateStartLunchTime = new Date(dataInStopdate.getFullYear(), dataInStopdate.getMonth(), dataInStopdate.getDate(), 12, 0)
        const starttime = dataInStartDate.getHours() + ':' + dataInStartDate.getMinutes()
        const stoptime = dataInStopdate.getHours() + ':' + dataInStopdate.getMinutes()


        const startDateTime = moment(dataInStartDate)
        const endDateTime = moment(dataInStopdate)
        startDateStartLunchTime = moment(startDateStartLunchTime)
        nextDateStartLunchTime = moment(nextDateStartLunchTime)
        startDateEndLunchTime = moment(startDateEndLunchTime)

        var startTime = moment(starttime, 'hh:mm')
        var stopTime = moment(stoptime, 'hh:mm')
        var startLunchTime = moment('12:00', 'hh:mm')
        var stopLunchTime = moment('12:59', 'hh:mm')

        if (dataInStartDate.getDate() < dataInStopdate.getDate()) {

            if (startDateTime.isBefore(startDateEndLunchTime) || endDateTime.isAfter(nextDateStartLunchTime)) {
                lunchlock = false
            }
            else {
                lunchlock = true
            }
        }
        else {          //ไม่ข้ามวัน
            if (startTime.isBefore(startLunchTime) && stopTime.isAfter(stopLunchTime) || (startTime.isBefore(startLunchTime) && stopTime.isBetween(startLunchTime, stopLunchTime, null, '(]')) || (startTime.isBetween(startLunchTime, stopLunchTime, null, '[]') && stopLunchTime.isBetween(startLunchTime, stopLunchTime, null, '[]'))) {
                lunchlock = false
            }
            else {
                lunchlock = true
            }
        }

        return lunchlock

    }

    //******************************************************************************************************************************************************************

    getLunchLockStatusForEdit(dataInStartDate, dataInStopdate) {
        let lunchlock = true
        const DateformatStartDate = new Date(dataInStartDate)
        const DateformatStopDate = new Date(dataInStopdate)

        let startDateStartLunchTime = new Date(DateformatStartDate.getFullYear(), DateformatStartDate.getMonth(), DateformatStartDate.getDate(), 12, 0)
        let startDateEndLunchTime = new Date(DateformatStartDate.getFullYear(), DateformatStartDate.getMonth(), DateformatStartDate.getDate(), 13, 0)
        let nextDateStartLunchTime = new Date(DateformatStopDate.getFullYear(), DateformatStopDate.getMonth(), DateformatStopDate.getDate(), 12, 0)

        const startDateTime = moment(dataInStartDate)
        const endDateTime = moment(dataInStopdate)

        startDateStartLunchTime = moment(startDateStartLunchTime)
        nextDateStartLunchTime = moment(nextDateStartLunchTime)
        startDateEndLunchTime = moment(startDateEndLunchTime)

        //console.log('startTime:' + startDateTime + ',stopTime:' + endDateTime + ',startlunch:' + startDateStartLunchTime + ',stoplunch:' + startDateEndLunchTime) 

        if (DateformatStartDate.getDate() < DateformatStopDate.getDate()) {

            if (startDateTime.isBefore(startDateEndLunchTime) || endDateTime.isAfter(nextDateStartLunchTime)) {
                lunchlock = false
            }
            else {
                lunchlock = true
            }
        }
        else {          //ไม่ข้ามวัน
            if (startDateTime.isBefore(startDateStartLunchTime) && endDateTime.isAfter(startDateEndLunchTime) || (startDateTime.isBefore(startDateStartLunchTime) && endDateTime.isBetween(startDateStartLunchTime, startDateEndLunchTime, null, '(]')) || (startDateTime.isBetween(startDateStartLunchTime, startDateEndLunchTime, null, '[]') && startDateEndLunchTime.isBetween(startDateStartLunchTime, startDateEndLunchTime, null, '[]'))) {
                lunchlock = false
            }
            else {
                lunchlock = true
            }
        }

        return lunchlock

    }


}