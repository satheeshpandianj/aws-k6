import http from 'k6/http';
import { sleep, check } from 'k6';


export let options = {
    tags: {
        ENV: __ENV.ENV,
        PROJECTNAME: __ENV.PROJECTNAME,
        APINAME: __ENV.APINAME,
    },
}


export default function () {
    let result = http.get('https://reqres.in/api/users?page=2');
    check(result, { 'Result body length is 1030 bytes': result.body.length === 1030 })
    check(result, { 'Status Code is 200 OK': result.status === 200 })

    //console.log(result.status);

    sleep(20);
}