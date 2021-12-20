import React, { Component } from 'react'
import decode from 'jwt-decode'
import axios from 'axios'
import moment from 'moment'
import swal from 'sweetalert'

export default class AuthService extends Component {
    constructor() {
        super()
        this.state = {}

        this.login = this.login.bind(this)
        this.fetchWithToken = this.fetchWithToken.bind(this)
        //this.getProfile = this.getProfile.bind(this)
    }

    async login(username, password) {             // fetch เพื่อเอา Token แล้ว call SetToken เพื่อ เก็บ Token ไว้ใน Local Storage 

        const webApiurl = await axios.get('api/ConfigFromAppSetting')

        return (
            axios({
                method: 'POST',
                url: webApiurl.data + '/api/v1/Employees/authenticate',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                data: {
                    Username: username,
                    Password: password
                }

            }).then(res => {

                localStorage.setItem('emp_email', res.data.empEmail)

                this.setToken(res.data.token)
                return Promise.resolve(res)
            })
        )

    }

    //*********************************************************************************************************************

    fetchWithToken(url, options) {           //เอาไว้ fetch ข้อมูลจาก api โดยใช้ Token แทน username password
        const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' }
        if (this.loggedIn() === true) {
            headers['Authorization'] = 'Bearer ' + this.getToken()

            try {
                return axios({ url: url, headers: headers, data: options.data, method: options.method })
            } catch (e) {
                console.log(e)
            }
        }
        else {
            swal({ text: 'Token หมดอายุ กรุณาทำการล็อคอินอีกครั้ง', icon: 'warning' })
            .then(() => window.location.href = '/Login')
        }            
    }

    //*********************************************************************************************************************

    getToken() {
        return localStorage.getItem('id_token');
    }

    //*********************************************************************************************************************

    setToken(idToken) {

        return localStorage.setItem('id_token', idToken);
    }

    //*********************************************************************************************************************

    loggedIn() {
        const token = this.getToken();
        try {
            if (this.isTokenExpired(token) === false) {
                return true
            }
            else {
                return false
            }
        } catch (e) {
            return false
        }


        /*return !!token && !this.isTokenExpired(token)*/   // token ปกติ return ข้อมูล !!token return true ถ้ามีtoken 
    }

    //*********************************************************************************************************************

    isTokenExpired(token) {
        //npm jwt-decode
        try {
            const decoded = decode(token)
            //console.log(decoded.exp * 1000)
            //console.log('decode:' + JSON.stringify(decoded) + ',moment: ' + moment() + 'dtnow: ' + Date.now())
            if (Date.now() >= decoded.exp * 1000) {          // exp มาเป็น UTC   จะเทียบต้องเอาDateNow ตอนนี้หาร 1000 จะได้เวลา UTC ณ ตอนนี้มา 54 > 55
                //console.log('expired:' + decoded.exp)
                return true 
            }
            else {
                //console.log('not expired:' + decoded.exp)
                return false
            }
        } catch (e) {
            return true
        }
    }

    //*********************************************************************************************************************

    logout() {
        localStorage.removeItem('id_token')
        localStorage.removeItem('emp_email')
    }

    //*********************************************************************************************************************

    getProfile() {
        return decode(this.getToken()) // result: {"nameid":"2","role":"Lead","nbf":1577075805,"exp":1577680605,"iat":1577075805}   // nameid = empid 
    }

    //*********************************************************************************************************************

    _IsSuccessResponse(response) {
        if (response.status >= 200 && response.status < 300) {
            return true
        } else {
            return false
        }
    }

    //*********************************************************************************************************************

}


