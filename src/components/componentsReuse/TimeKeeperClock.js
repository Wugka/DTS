import React, { Component, useState } from 'react';
import Timekeeper from 'react-timekeeper'

export default class TimeKeeperClock extends Component {
    constructor(props) {
        super(props)
        this.state = {time: props.time}
    }

    timekeepfunc() {
        const [time, setTime] = this.state.time
        const [showTime, setShowTime] = useState(false)
        return (

            <React.Fragment>
                {showTime && <Timekeeper time={time}
                    onChange={(newTime) => setTime(newTime.formattedSimple)}
                    onDoneClick={() => setShowTime(false)}
                    hour24Mode
                    switchToMinuteOnHourSelect
                    closeOnMinuteSelect
                    doneButton={() => (<div style={{ textAlign: 'center' }}>Click and drag </div>)} />}
                {!showTime && <input onClick={() => setShowTime(true)} value={time} />}
            </React.Fragment>
        )
    }

    render() {
        return (
            <React.Fragment>
                <this.timekeepfunc />
            </React.Fragment>
            )

    }
}

