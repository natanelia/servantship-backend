/* eslint-env mocha */

import request from "supertest";
import httpStatus from "http-status";
import chai, { expect } from "chai";
import sequelize from "../../core/sequelize";
import User from "../models/user.model";
import app from "../../index";

chai.config.includeStack = true;

/**
 * root level hooks
 */
before(done => {
  sequelize
    .sync({ force: true, match: /_test$/, logging: false })
    .then(() => done());
});

after(done => {
  User.drop().then(() => done());
});

describe("## User APIs", () => {
  let user = {
    phone: "082120602126",
    name: "Natan"
  };

  describe("# POST /api/users", () => {
    it("should create a new user", done => {
      request(app)
        .post("/api/users")
        .send(user)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body.phone).to.equal(user.phone);
          user = res.body;

          done();
        })
        .catch(done);
    });
  });

  describe("# GET /api/users/:userId", () => {
    it("should get user details", done => {
      request(app)
        .get(`/api/users/${user.id}`)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body.phone).to.equal(user.phone);
          expect(res.body).to.not.have.property('password');
          expect(res.body).to.not.have.property('activationCode');
          done();
        })
        .catch(done);
    });

    it("should report error with message - Bad Request, if user id is not uuid", done => {
      request(app)
        .get("/api/users/12345")
        .expect(httpStatus.BAD_REQUEST)
        .then(res => {
          expect(res.body.message).to.equal("\"userId\" must be a valid GUID");
          done();
        })
        .catch(done);
    });

    it("should report error with message - Not found, when user does not exist", done => {
      request(app)
        .get("/api/users/4096cf49-e883-49c2-b0e6-10278452532a")
        .expect(httpStatus.NOT_FOUND)
        .then(res => {
          expect(res.body.message).to.equal("Not Found");
          done();
        })
        .catch(done);
    });
  });

  describe("# PUT /api/users/:userId", () => {
    it("should update user details", done => {
      user.phone = "KK";
      request(app)
        .put(`/api/users/${user.id}`)
        .send(user)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body.phone).to.equal("KK");
          done();
        })
        .catch(done);
    });
  });

  describe("# GET /api/users/", () => {
    it("should get all users", done => {
      request(app)
        .get("/api/users")
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.be.an("array");
          done();
        })
        .catch(done);
    });

    it("should get all users (with limit and skip)", done => {
      request(app)
        .get("/api/users")
        .query({ limit: 10, skip: 1 })
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.be.an("array");
          done();
        })
        .catch(done);
    });
  });

  describe("# DELETE /api/users/", () => {
    it("should delete user", done => {
      request(app)
        .delete(`/api/users/${user.id}`)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.equal("082120602126");
          done();
        })
        .catch(done);
    });
  });
});
