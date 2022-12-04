const Models = require('./models.js');

module.exports = {
  getReviews: (req, res) => {
    var productId = 2.;

    Models.findReviews(productId, (err, results) => {
      if(err) {
        res.status(500).send(err);
      }
      res.status(200).send(results);
    });
        // var data = {
        //   body: results[0].body,
        //   data: results[0].data,
        //   photos: results[1]
        //   rating: results.[0],
        //   rating: results[0].rating,
        //   recommend: results[0].recommended,
        //   response: results[0].response,
        //   review_id: results[0].review_id,
        //   summary: results[0].summary,
        // }
  },
  getMeta: (req, res) => {
    // var data = {
    //   characteristics: {
    //     Comfort: {id: , value:},
    //     Fit: {id: , value:},
    //     Length: {id: , value:},
    //     Quality: {id: , value:},
    //     product_id: ,
    //   },
    //   ratings: {1:, 2:, 3:, 4:, 5:},
    //   recommend: {false:, true: }
    // }
    var productId = 2;

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
        console.log(data.characteristics.Quality);
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
    Models.insertReview(req.body);
  },

  helpful: (req, res) => {

  },

  report: (req, res) => {

  }
}