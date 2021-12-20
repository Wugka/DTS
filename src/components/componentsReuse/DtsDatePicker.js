import React, { Component } from 'react'
import '../../css/datePicker.css'
import subDays from 'date-fns/subDays'
import { Label, FormGroup } from 'reactstrap'
import DatePicker from 'react-datepicker'
 
export default class DtsDatePicker extends Component {
    constructor() {
        super()

        this.handleDateChangeRaw = this.handleDateChangeRaw.bind(this)
    }

    handleDateChangeRaw(e) {
        e.preventDefault()
    }


    render() {
        const now = new Date()
        now.setHours(0, 0, 0, 0)
        var minDate = subDays(now, 7)       // แก้ปฏิทินย้อนหลังได้กี่วันตรงนี้

        let labelMargin = { marginRight: '10px' }
        if (this.props.name == 'stopDate') {
            labelMargin = {marginRight:'15px' }
        }

        let dp = <DatePicker selected={this.props.startDate}
            minDate={minDate}
            maxDate={now}
            dayClassName={date => (date > now || date < minDate) ? 'outofrange' : ''}
            style={{ margin: '5px' }}
            onChange={date => this.props.handleChange(this.props.name, date)}
            dateFormat="dd/MM/yyyy"
            onChangeRaw={this.handleDateChangeRaw}
        />

        if (this.props.unlimitpast === true) {
            dp = <DatePicker selected={this.props.startDate}
                maxDate={now}
                dayClassName={date => (date > now) ? 'outofrange' : ''}
                style={{ margin: '5px' }}
                onChange={date => this.props.handleChange(this.props.name, date)}
                dateFormat="dd/MM/yyyy"
                onChangeRaw={this.handleDateChangeRaw}
            />
        }
        else if (this.props.allDateAvailable === true) {
            dp = <DatePicker selected={this.props.startDate}
                style={{ margin: '5px' }}
                onChange={date => this.props.handleChange(this.props.name, date)}
                dateFormat="dd/MM/yyyy"
                onChangeRaw={this.handleDateChangeRaw}
            />
        }

        return (
            <FormGroup>
                <div className={this.props.invalidDate === true ? 'blackstyledatepickerInvalid' :'blackstyledatepicker'}>
                    {this.props.labelname ? <Label style={labelMargin}> {this.props.labelname} </Label> : ''} 
                    {dp}
                </div>
                </FormGroup>
        )

    }

}