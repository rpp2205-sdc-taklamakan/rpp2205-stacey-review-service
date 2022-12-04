var db = require('../database/db');

module.exports = {
  findReviews: (productId, callback) => {
    var photosArr = [];
    var results = [];
    db.query(`Select * from reviews where product_id=${productId}`, (err, reviews) => {
      if(err) {
        callback(err);
      }
      //callback(null, reviews);
      console.log(reviews);
      reviews.forEach((element) => {
        db.query(`Select * from photos where review_id=${element.id}`, (err, photos) => {
          if(err) {
            callback(err);
          }

          if(photos.length > 0) {
            console.log(photos);
            photos.forEach((element) => {
              photosArr.push(element.url);
            });
          }
          results.push({
            body: element.body,
            data: element.data,
            photos: photosArr,
            rating: element.rating,
            recommend: element.recommended,
            response: element.response,
            review_id: element.review_id,
            summary: element.summary,
          });
          console.log(results);
        });
      });

      callback(null, results)

    });

    // db.queryAsync(`Select * from reviews where product_id=${productId}`)
    // .then((reviews) => {

    //   reviews.forEach((element => {
    //     db.queryAsync(`Select * from photos where review_id=${element}`)
    //       .then((photos) => {
    //         results.push({
    //           body: element.body,
    //           data: element.data,
    //           photos: photosArr,
    //           rating: element.rating,
    //           recommend: element.recommended,
    //           response: element.response,
    //           review_id: element.review_id,
    //           summary: element.summary,
    //         });
    //       })
    //   }));
    // });
  },
  findPhotos: (reviewId) => {
    var photosArr = [];
    db.query(`Select * from reviews where product_id=${productId}`, (err, results) => {
      if(err) {
        callback(err);
      }
      results.forEach
    })
    return db.queryAsync(`Select * from photos where product_id=${reviewId}`)
  },

  findMeta: (productId) => {
    var promises = [
      db.queryAsync(`SELECT rating, AVG(rating) FROM reviews WHERE product_id = ${productId} GROUP BY rating`),
      db.queryAsync(`SELECT charID.name, charID.id, AVG(c.value) FROM characteristics c INNER JOIN characteristic_ids charID on (c.characteristic_id = charID.product_id) WHERE charID.product_id = ${productId} GROUP BY charID.name, charID.id`),
      db.queryAsync(`SELECT recommended, COUNT(recommended) FROM reviews WHERE product_id = ${productId} GROUP BY recommended`)
    ];
    return Promise.all(promises);
  }
};