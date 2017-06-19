'use strict';

const Query = require('../../lib/query/query');

describe("Query", function () {
  describe("selectList", function () {
    it("should join arrays", function () {
      const result = new Query({}, {columns: ["col1", "col2"]});
      assert.equal(result.selectList(), "col1,col2");
    });

    it("should leave anything else alone", function () {
      const result = new Query({}, {columns: "count(1)"});
      assert.equal(result.selectList(), "count(1)");
    });

    it("should default to *", function () {
      const result = new Query();
      assert.equal(result.selectList(), "*");
    });
  });

  describe("queryOptions", function () {
    it("should emit an order by", function () {
      const result = new Query();
      assert.equal(result.queryOptions(), " ORDER BY 1");
    });

    it("should add an offset", function () {
      const result = new Query({}, {offset: 10});
      assert.equal(result.queryOptions(), " ORDER BY 1 OFFSET 10");
    });

    it("should add a limit", function () {
      const result = new Query({}, {limit: 10});
      assert.equal(result.queryOptions(), " ORDER BY 1 LIMIT 10");
    });

    it("should add both offset and limit", function () {
      const result = new Query({}, {offset: 10, limit: 10});
      assert.equal(result.queryOptions(), " ORDER BY 1 OFFSET 10 LIMIT 10");
    });

    it("should accept an array of sort criteria", function () {
      const result = new Query({}, {
        order: [
          {field: "col1", direction: "asc"},
          {field: "body->>'col2'", direction: "desc", type: "varchar"},
          {field: "col3 + col4"}
        ]
      });

      assert.equal(result.queryOptions(), " ORDER BY col1 asc,(body->>'col2')::varchar desc,col3 + col4 asc");
    });

    it("should build an order clause for a document table", function () {
      const result = new Query({}, {
        order: [
          {field: "col1", direction: "asc", type: "int"},
          {field: "col2", direction: "desc", type: "varchar"}
        ],
        orderBody: true
      });

      assert.equal(result.queryOptions(), " ORDER BY (body->>'col1')::int asc,(body->>'col2')::varchar desc");
    });
  });
});
