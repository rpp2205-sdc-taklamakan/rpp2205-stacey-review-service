var db = require('../database/db');

module.exports = {
  findReviews: (productId, count, sort) => {
    var photosArr = [];
    var results = [];

    var results = [];
    var innerObj = {};

    var order = '';
    if(sort === 'relevant') {
      order = 'reviews.helpfulness DESC, date DESC';
    }
    if(sort === 'helpful') {
      order = 'reviews.helpfulness DESC';
    }
    if(sort === 'newest') {
      order = 'date DESC'
    }

    //return db.queryAsync(`SELECT * FROM reviews WHERE product_id = 2 GROUP BY id ORDER BY ${order} LIMIT ${count}`)

    return db.queryAsync(`SELECT reviews.id, reviews.product_id, reviews.rating, reviews.date, reviews.summary, reviews.body, reviews.recommended,
    reviews.response, reviews.reviewer_name, reviews.helpfulness, JSON_ARRAYAGG(JSON_OBJECT('id', photos.id, 'url', JSON_UNQUOTE(photos.url))) AS photos FROM reviews LEFT JOIN photos ON reviews.id = photos.review_id WHERE
    reviews.product_id = ${productId} AND reviews.reported != 'true' GROUP BY reviews.id ORDER BY ${order} LIMIT ${count};`);

  },
  findPhotos: (reviewId) => {
    return db.queryAsync(`Select url from photos where review_id=${reviewId}`)
  },

  findMeta: (productId) => {
    var promises = [
      db.queryAsync(`SELECT rating, AVG(rating) FROM reviews WHERE product_id = ${productId} GROUP BY rating`),
      db.queryAsync(`SELECT charID.name, charID.id, AVG(c.value) FROM characteristics c INNER JOIN characteristic_ids charID on (c.characteristic_id = charID.product_id) WHERE charID.product_id = ${productId} GROUP BY charID.name, charID.id`),
      db.queryAsync(`SELECT recommended, COUNT(recommended) FROM reviews WHERE product_id = ${productId} GROUP BY recommended`)
    ];
    return Promise.all(promises);
  },
  insertReview: (productId, obj, photos) => {
    db.queryAsync(`BEGIN;
    INSERT INTO reviews (null, ${productId}, ${obj.rating}, ${new Date()}, ${obj.summary}, ${obj.body}, ${obj.recommend}, 'false',
      ${obj.name}, ${obj.email}, ${obj.response}, 0;
      SET last_id_in_reviews = LAST_INSERT_ID();
      INSERT INTO photos VALUES${photos}`)
      .then(() => {
        return db.queryAsync('SELECT LAST_INSERT_ID();')
      })
  },

  markHelpful: (reviewId) => {
    return db.queryAsync(`UPDATE reviews SET helpfulness = helpfulness + 1 WHERE id = ${reviewId}`);
  },

  reported: (reviewId) => {
    return db.queryAsync(`UPDATE reviews SET reported = 'true' WHERE id = ${reviewId}`);
  }
}