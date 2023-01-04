const express = require('express');
const app = express();
const port = 3001;
const Controller = require('./controller');
const bodyParser = require('body-parser');
const newrelic = require('newrelic');

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send("Reviews Service");
});

app.get('/loaderio-1fc425625de99b0b2d3a4847dd646271', (req, res) => {
  res.status(200).send('loaderio-1fc425625de99b0b2d3a4847dd646271');
});

app.get('/reviews', Controller.getReviews); //DONE

app.get('/reviews/meta', Controller.getMeta); //DONE

app.post('/reviews', Controller.postReview);

app.put('/reviews/:review_id/helpful', Controller.helpful); //DONE

app.put('/reviews/:review_id/report', Controller.report); //DONE


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

module.exports = app;