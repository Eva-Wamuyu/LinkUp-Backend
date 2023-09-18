import http from 'k6/http';
import {sleep, check} from 'k6';
import { BASE_URL } from './utility.js';

export const options = {
    stages: [
        { duration: '5s', target: 100 },
        { duration: '5s', target: 50 },
      ],
};


export default function(){
    const url = `${BASE_URL}user/auth/login`
    const body = JSON.stringify({
        emailOrUsername: 'test@gmail.com',
        password: '1234nd'
    })
    const params = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const response = http.post(url, body, params)
    
    check(response, {
        'is status 200': (res)=>res.status === 200,
        'is successfully logged in': (res) => res.body.includes('Login successful'),
    })

    sleep(1)
}
