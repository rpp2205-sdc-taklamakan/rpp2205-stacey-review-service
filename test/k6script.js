import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 1000,
  duration: "30s"
};

export default function () {
  const BASE_URL = 'http://localhost:3001';

  const responses = http.batch([
    ['GET', `${BASE_URL}/reviews/?product_id=1000011`],
    ['GET', `${BASE_URL}/reviews/meta?product_id=1000011`]
  ]);

  check(responses[0],  {
    'GET /reviews': (r) => r.status === 200
  })
  check(responses[1],  {
    'GET /reviews/meta': (r) => r.status === 200
  })

  sleep(1);
}