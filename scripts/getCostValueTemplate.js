/***************************************************************************
Script Name		: getCostValueTemplate.js
Date Created	: 12/07/2021
Author			: Satheesh Pandian
Description		: Endpoint returning the available cost value templates for specified parameters.
Request inputs	: 
                 1. Market 
                 2. Brand
                 3. Sales Model
Request header	:	
                 1. VCC-Api-Key
                 2. Accept
Method			: GET

***************************************************************************/

//importing the libraries for run the scripts
import { sleep } from 'k6';
import http from 'k6/http';
import { check } from 'k6';
import { Rate } from 'k6/metrics';
import { Counter } from 'k6/metrics';
import { Trend } from 'k6/metrics';

// Create an object to get the error rate
let errorRate = new Rate('getCostValueErrorRate');


export let options = {
    // Sending the parameters to Grafana to filter the performance metrics based on env/project/apiname
    tags: {
        ENV: __ENV.ENV,
        PROJECTNAME: __ENV.PROJECT,
        APINAME: __ENV.APINAME,
    },
    // Setting the test configuration along with threshold value to check the performance
    thresholds: {
        'getCostValueErrorRate':
            [
                {
                    //more than 5% of errors will abort the test
                    threshold: 'rate <0.05', abortOnFail: true, delayAbortEval: '15s'
                }
            ],
        'http_req_duration':
            [
                {
                    threshold: 'p(95) < 1000', abortOnFail: true, delayAbortEval: '10s'
                }
            ],
    }
};


export default function () {
    // Get the URL 
    let url = 'https://gw.qa.consumer.api.volvocars.com/dcom/financialoptions/costvaluetemplates?market=DE&brand=VCC&salesModel=sub';

    //Headers to be passed in the request
    let params = {
        headers: {
            'Accept': 'application/vnd.volvocars.api.dcom.financialoptions.costvaluetemplatesresponse.v1+json',
            'VCC-Api-Key': '1558dc36508249a3a0d545d3609a1fe9' // API key is for authentication
        }
    };

    //Hit the payload using GET method
    let response = http.get(url, params);

    //console.log(response.status);

    //Check the response code is 200 or not
    check(response, { 'Status Code is 200 ': (result) => result.status === 200 },);

    // Increase the error rate if the response code is not 200
    errorRate.add(response.status !== 200);

    // wait for 1 second
    sleep(1);
}

/*************************************************************************************
                                end of script
*************************************************************************************/