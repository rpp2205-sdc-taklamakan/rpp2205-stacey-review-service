var db = require('../database/db');

module.exports = {
  findReviews: (productId, count, sort) => {
    return db.queryAsync(`SELECT
    JSON_PRETTY(
      JSON_ARRAYAGG(
          JSON_OBJECT(
            'body', body,
            'date', from_unixtime(date/1000),
            'helpfulness', helpfulness,
            'rating', rating,
            'recommend', recommend,
            'response', response,
            'review_id', review_id,
            'reviewer_name', reviewer_name,
            'summary', summary,
            'photos', photos
          )
        )
    ) AS results

    FROM (
      SELECT
              r.body AS body,
              r.date AS date,
              r.helpfulness AS helpfulness,
              r.rating AS rating,
              r.recommended AS recommend,
              r.response AS response,
              r.id AS review_id,
              r.reviewer_name AS reviewer_name,
              r.summary AS summary,
              JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', p.id,
            'url', p.url
          )
        ) AS photos
      FROM reviews r JOIN photos p ON r.id = p.review_id
          WHERE r.product_id = ${productId} AND r.reported != 'true'
          GROUP BY r.id
          UNION
          SELECT
              r.body,
              r.date,
              r.helpfulness,
              r.rating,
              r.recommended,
              r.response,
              r.id,
              r.reviewer_name,
              r.summary,
              JSON_ARRAY()
      FROM reviews r LEFT OUTER JOIN photos p ON r.id = p.review_id
          WHERE r.product_id = ${productId} AND r.reported != 'true' AND p.url IS NULL
    ) AS p;`);

  },
  findPhotos: (reviewId) => {
    return db.queryAsync(`Select url from photos where review_id=${reviewId}`)
  },

  findMeta: (productId) => {
    return db.queryAsync(`SELECT JSON_PRETTY(JSON_OBJECTAGG(name, chars)) AS results FROM (
      SELECT charID.name AS name,
        JSON_OBJECT('id', charID.id, 'value', AVG(c.value)) AS chars
            FROM characteristics c INNER JOIN characteristic_ids charID on
        (c.characteristic_id = charID.product_id)
        WHERE charID.product_id = ${productId} GROUP BY charID.name, charID.id) AS p
    UNION ALL
    SELECT JSON_PRETTY(JSON_OBJECTAGG(rating, averages)) AS ratings FROM (
    SELECT rating as rating, AVG(rating) as averages FROM reviews WHERE product_id = ${productId} GROUP BY rating) AS q
    UNION ALL
    SELECT JSON_PRETTY(JSON_OBJECTAGG(r, c)) AS recommended FROM (
      SELECT recommended as r, COUNT(recommended) as c FROM reviews WHERE product_id = ${productId} GROUP BY recommended) AS r;`);

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