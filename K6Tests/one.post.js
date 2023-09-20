import http from 'k6/http';
import { check, sleep} from 'k6';
import { BASE_URL } from './utility.js';

export const options = {
   iterations: 1
};


export default function(){
    const url = `${BASE_URL}post/2662fc37-b306-4af8-8163-e5528b08103a`
    
    const params = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const response = http.get(url,params)
    
    check(response, {
        'is status 200': (res)=>res.status === 200,
        
    })

    sleep(1)
}
