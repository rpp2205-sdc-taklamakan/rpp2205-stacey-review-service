const express = require('express');
const app = express();
const port = 3001;
const Controller = require('./controller');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send("Reviews Service");
});


app.get('/reviews', Controller.getReviews);

app.get('/reviews/meta', Controller.getMeta); //DONE

app.post('/reviews', Controller.postReview);

app.put('/reviews/:review_id/helpful', Controller.helpful); //DONE

app.put('/reviews/:review_id/report', Controller.report); //DONE


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})