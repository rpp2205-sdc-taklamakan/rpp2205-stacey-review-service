const Models = require('./models');

module.exports = {
  getReviews: (req, res) => {
    var productId = req.query.product_id;
    var count = req.query.count || 5;
    var sort = req.query.sort || 'relevant';

    var results = [];

    Models.findReviews(productId, count, sort)
    .then((reviews) => {

      var arr = reviews[0].map((element) => {
        return {
          body: element.body.replace(/\"/g, ""),
          date: new Date(parseInt(element.date) * 1000),
          helpfulness: element.helpfulness,
          photos: element.photos,
          rating: element.rating,
          recommend: element.recommended.replace(/\"/g, ""),
          response: element.response.replace(/\"/g, ""),
          review_id: element.id,
          summary: element.summary.replace(/\"/g, "")
        }
      })

      // reviews[0].forEach((element) => {
      //   results.push({
      //     body: element.body.replace(/\"/g, ""),
      //     date: new Date(parseInt(element.date) * 1000),
      //     helpfulness: element.helpfulness,
      //     photos: element.photos,
      //     rating: element.rating,
      //     recommend: element.recommended.replace(/\"/g, ""),
      //     response: element.response.replace(/\"/g, ""),
      //     review_id: element.id,
      //     summary: element.summary.replace(/\"/g, "")
      //   });
      // });

      res.status(200).send({count: count, page: 1, product: product_id, results: arr});
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
    data.recommend = {};

    Models.findMeta(productId)
    .then((results) => {
      var ratings = results[0];
      var chars = results[1];
      var recommend = results[2];

      ratings[0].forEach((element) => {
        data.ratings[element.rating] = element['AVG(rating)'];
      });
      chars[0].forEach((element) => {
        data.characteristics[element.name.replace(/\"/g, "")] = {
          id: element.id,
          value: element['AVG(c.value)']
        };
      });
      data.characteristics.productId = productId;
      recommend.forEach((element) => {
        data.recommend[element.recommended] = element['COUNT(recommended)'];
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
    Models.insertReview(req.body)
    .then(() => {
      res.status(201);
    })
    .catch((err) => {
      res.status(500).send(err);
    })
  },

  helpful: (req, res) => {
    Models.markHelpful(productId)
    .then((results) => {
      res.status(204);
    })
    .catch((err) => {
      res.status(500).send(err);
    })
  },

  report: (req, res) => {
    Models.reported(productId)
      .then(() => {
        res.status(204);
      })
      .catch((err) => {
        res.status(500).send(err);
      })
  }
}