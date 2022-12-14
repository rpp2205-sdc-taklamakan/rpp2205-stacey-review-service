const Models = require('./models');

module.exports = {
  getReviews: (req, res) => {
    var productId = req.query.product_id;
    var count = req.query.count || 5;
    var sort = req.query.sort || 'relevant';

    var results = [];
    var result = {count: count, page: 1, product: productId};

    Models.findReviews(productId, count, sort)
    .then((reviews) => {
      reviews[0].forEach((element) => {
        // if(JSON.parse(element.photos.id === null)) {
        //   element.photos = [];
        // }

        results.push({
          body: element.body.replace(/\"/g, ""),
          date: new Date(parseInt(element.date) * 1000),
          helpfulness: element.helpfulness,
          photos: JSON.parse(element.photos),
          rating: element.rating,
          recommend: JSON.parse(element.recommended.replace(/\"/g, "")),
          response: JSON.parse(element.response),
          review_id: element.id,
          summary: element.summary.replace(/\"/g, "")
        });
      });

      result.results = results;
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).send(err);
    })
  },
  getMeta: (req, res) => {

    var productId = req.query.product_id;

    var data = {};
    data.characteristics = {};
    data.ratings = {};
    data.recommended = {};

    Models.findMeta(productId)
    .then((results) => {
      var ratings = results[0][0];
      var chars = results[1][0];
      var recommend = results[2][0];

      ratings.forEach((element) => {
        data.ratings[element.rating] = element['AVG(rating)'];
      });
      chars.forEach((element) => {
        data.characteristics[element.name.replace(/\"/g, "")] = {
          id: element.id,
          value: element['AVG(c.value)']
        };
      });
      data.characteristics.productId = productId;

      recommend.forEach((element) => {
        data.recommended[element.recommended] = element['COUNT(recommended)'];
      });
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