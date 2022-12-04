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
  helpfulness int
)

-- LOAD DATA INFILE ''
-- INTO TABLE reviews
-- FIELDS TERMINATED BY ','
-- IGNORE 1 ROWS;
-- CREATE TABLE characteristics;
-- CREATE TABLE