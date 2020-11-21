// server.js

const express = require("express");
const life = require("./life");
const server = express();

const body_parser = require("body-parser");

// parse JSON (application/json content-type)
server.use(body_parser.json());

const port = process.env.PORT || 3000;

// << db setup >>
const db = require("./db");
const dbName = "Blog";
const collectionName = "Life";

// << db init >>

db.initialize(dbName, collectionName, function (dbCollection) { // successCallback
  // get all items
  // dbCollection.find().toArray(function (err, result) {
  //   if (err) throw err;
  //   console.log(result);
  // });

  // << db CRUD routes >>
  server.get("/events", (request, response) => {
    // return updated list
    dbCollection.find().toArray((error, result) => {
      if (error) throw error;
      response.json({list_tooltip: life.render_all_weeks(result)});
    });
  });

  server.post("/event", (request, response) => {
    const event = request.body;
    dbCollection.insertOne(event, (error, result) => { // callback of insertOne
      if (error) throw error;
      // return updated list
      dbCollection.find().toArray((_error, _result) => { // callback of find
        if (_error) throw _error;
        response.json(_result);
      });
    });
  });

  server.put("/items/:id", (request, response) => {
    const itemId = request.params.id;
    const item = request.body;
    console.log("Editing item: ", itemId, " to be ", item);

    dbCollection.updateOne({ id: itemId }, { $set: item }, (error, result) => {
      if (error) throw error;
      // send back entire updated list, to make sure frontend data is up-to-date
      dbCollection.find().toArray(function (_error, _result) {
        if (_error) throw _error;
        response.json(_result);
      });
    });
  });

  server.delete("/items/:id", (request, response) => {
    const itemId = request.params.id;
    console.log("Delete item with id: ", itemId);

    dbCollection.deleteOne({ id: itemId }, function (error, result) {
      if (error) throw error;
      // send back entire updated list after successful request
      dbCollection.find().toArray(function (_error, _result) {
        if (_error) throw _error;
        response.json(_result);
      });
    });
  });

}, function (err) { // failureCallback
  throw (err);
});

server.listen(port, () => {
  console.log(`Server listening at ${port}`);
});