import { SharedArray } from 'k6/data';
import http from "k6/http";
import { check, sleep } from "k6";

/* Below is the command to run this script with k6.
Test will run with 100 Req/Sec for 300 seconds with 1000 preallocated VUs.
k6 run -e RATE=100 -e DURATION=300 -e PREALLOCATEDVUS=1000 XBorg_login.js
*/

const loginData = new SharedArray('signup', function () {
  // here you can open files, and then do additional processing or generate the array with data dynamically
  const f = JSON.parse(open('../loadTestData/login.json'));
  return f; // f must be an array[]
});

export const options = {
  scenarios: {
    'constant-arrival-rate': {
      executor: 'constant-arrival-rate',
      rate: `${__ENV.RATE}`,
      timeUnit: '1s',
      duration: `${__ENV.DURATION}`,
      preAllocatedVUs: `${__ENV.PREALLOCATEDVUS}`,
      gracefulStop: '1s',
    },
  },
};

const randomLoginData = data[Math.floor(Math.random() * loginData.length)];

export default function () {
  let requestURL = "http://localhost:8080/v1/user/login"

  const params = {
    headers: {
      "accept": "application/json",
    },
  };

  const result = http.post(requestURL, JSON.stringify(randomLoginData), params);

  check(result, {
    'status was 200': (response) => {
      if (response.status !== 200) {
        console.log(response.status, response.body, url);
      }
      return response.status === 200;
    },
  });
}