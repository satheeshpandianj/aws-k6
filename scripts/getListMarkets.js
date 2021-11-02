/***************************************************************************
Script Name		: getListMarkets.js
Date Created	: 12/07/2021
Author			: Satheesh Pandian
Description		: Get a list of configured markets.
Request inputs	: None
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
let errorRate = new Rate('getListMarketErrorRate');

// Setting the test configuration along with threshold value to check the performance
export let options = {
    tags: {
        ENV: __ENV.ENV,
        PROJECTNAME: __ENV.PROJECTNAME,
        APINAME: __ENV.APINAME,
    },
}

export default function () {
    // Get the URL 
    let url = 'https://gw.qa.consumer.api.volvocars.com/dcom/financialoptions/markets';

    //Headers to be passed in the request
    let params = {
        headers: {
            'Accept': 'application/vnd.volvocars.api.dcom.financialoptions.marketsresponse.v1+json',
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
    sleep(10);
}

/*************************************************************************************
                                end of script
*************************************************************************************/