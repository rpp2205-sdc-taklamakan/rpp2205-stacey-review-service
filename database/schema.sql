DROP DATABASE IF EXISTS RatingsReviews;
CREATE DATABASE RatingsReviews;
USE RatingsReviews;

CREATE TABLE reviews (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  product_id int,
  rating int,
  date VARCHAR(255),
  summary VARCHAR(255),
  body VARCHAR(255),
  recommended VARCHAR(255),
  reported VARCHAR(255),
  reviewer_name VARCHAR(255),
  reviewer_email VARCHAR(255),
  response VARCHAR(255),
  helpfulness int,
  INDEX productId (product_id, id)
);

CREATE TABLE photos (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  review_id int,
  url VARCHAR(255)
  INDEX reviewId (review_id, id)
  FOREIGN KEY (review_id)
    REFERENCES reviews(id)
);

CREATE TABLE characteristic_ids (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  product_id int,
  name VARCHAR(255),
  INDEX productId (product_id, id)
);

CREATE TABLE characteristics (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  characteristic_id int,
  review_id int,
  value int,
  INDEX reviewId (review_id, id)
  FOREIGN KEY (characteristic_id)
    REFERENCES characteristics(id),
  FOREIGN KEY (review_id)
    REFERENCES reviews(id)
);


-- LOAD DATA INFILE ''
-- INTO TABLE reviews
-- FIELDS TERMINATED BY ','
-- IGNORE 1 ROWS;
-- CREATE TABLE characteristics;
-- CREATE TABLE