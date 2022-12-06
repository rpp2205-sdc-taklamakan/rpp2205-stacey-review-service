const request = require('supertest');
const expect = require('chai').expect;
const app = require('../server/index.js');

  describe("GET /reviews", function() {
    it("it should have status code 200 and certain keys", async function() {
      const response = await request(app) .get(`/reviews/?product_id=${2}`);

      expect(response.status).to.eql(200);
      expect(response.body).to.have.property('count');
      expect(response.body).to.have.property('page');
      expect(response.body).to.have.property('results');
    });
  });

  describe("GET /reviews/meta", function() {
    it("it should have status code 200 and certain keys", async function() {
      const response = await request(app) .get(`/reviews/meta?product_id=${2}`);

      expect(response.status).to.eql(200);
      expect(response.body).to.have.property('characteristics');
      expect(response.body).to.have.property('ratings');
      expect(response.body).to.have.property('recommended');
    });
  });

  describe("PUT /reviews/:review_id/helpful", function() {
    it("it should have status code 204", async function() {
      const response = await request(app) .put(`/reviews/${3}/helpful`);

      expect(response.status).to.eql(204);
    });
  });

  describe("PUT /reviews/:review_id/report", function() {
    it("it should have status code 204", async function() {
      const response = await request(app) .put(`/reviews/${3}/report`);

      expect(response.status).to.eql(204);
    });
  });

//   const request = require("supertest")("https://airportgap.dev-tester.com/api");
// const expect = require("chai").expect;

// describe("GET /airports", function () {
//   it("returns all airports, limited to 30 per page", async function () {
//     const response = await request.get("/airports");

//     expect(response.status).to.eql(200);
//     expect(response.body.data.length).to.eql(30);
//   });
// });