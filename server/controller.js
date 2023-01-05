const Models = require('./models');

var sortReviews = (reviews, count, sort) => {
  var sortby;
  if(sort === 'relevant') {
    sortby = 'id';
  } else if(sort === 'newest') {
    sortby = 'date';
  } else {
    sortby = 'helpfulness';
  }
  reviews.sort((a, b) => {
    return (b[sortby] - a [sortby]);
  });
  return reviews.slice(0, count);
}

module.exports = {
  getReviews: (req, res) => {
    var productId = req.query.product_id;
    var count = req.query.count || 5;
    var sort = req.query.sort || 'relevant';

    Models.findReviews(productId, count, sort)
    .then((reviews) => {
      var result = {
        count: count,
        page: 1,
        product: productId,
        results: sortReviews(JSON.parse(reviews[0][0].results), count, sort)
      }
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).send(err);
    })
  },
  getMeta: (req, res) => {

    var productId = req.query.product_id;

    Models.findMeta(productId)
    .then((results) => {
      var data = {
        characteristics: results[0][0].results,
        ratings: results[0][1].results,
        recommended: results[0][2].results,
        product_id: productId
      }
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    })
  },

  postReview: (req, res) => {
    var testObj = {
      product_id: 231900,
      rating: 5,
      summary: 'this is just an example',
      body: 'this is just an example',
      recommend: 'true',
      name: 'Jules Cobb',
      email: 'jules@gmail.com'
    }
    var photoValues = req.body.photos.map((element) => {
      return ` (null, last_id_in_reviews, ${element})`
    });
    Models.insertReview(req.query.product_id, req.body, photoValues.join())
    .then(() => {
      res.status(201);
    })
    .catch((err) => {
      res.status(500).send(err);
    })
  },

  helpful: (req, res) => {
    Models.markHelpful(req.params.review_id)
    .then((results) => {
      res.sendStatus(204);
    })
    .catch((err) => {
      res.status(500).send(err);
    })
  },

  report: (req, res) => {
    Models.reported(req.params.review_id)
      .then((results) => {
        res.sendStatus(204);
      })
      .catch((err) => {
        res.status(500).send(err);
      })
  }
}