import http from 'k6/http';
import { check, sleep} from 'k6';
import { BASE_URL } from './utility.js';
export const options = {
  vus: 3, // Key for Smoke test. Keep it at 2, 3, max 5 VUs
  duration: '1m', // This can be shorter or just a few iterations
};

export default () => {
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
};
