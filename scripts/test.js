import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
    tags: {
        ENV: __ENV.ENV,
        PROJECTNAME: __ENV.PROJECTNAME,
        APINAME: __ENV.APINAME,
    },
}
export default function () {
    let result = http.get("https://reqres.in");
    console.log(result.status);
}