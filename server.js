var http = require("http");
var url = require("url");
var path = require("path");
var fs = require("fs");
var port = process.argv[2] || 3000;
var mysql = require("mysql");
var qs = require("querystring");

http.createServer(function(request, response) {

  var uri = url.parse(request.url).pathname;
  var filename = path.join(process.cwd(), uri);

  fs.exists(filename, function(exists) {
    if(!exists) {
      if (uri === "/inventory.json") {
        inventoryJson(request, response);
      }
      else if (uri === "/update-inventory.json") {
        updateInventoryJson(request, response);
      }
      else if (uri === "/order.json") {
        orderJson(request, response);
      }
      else if (uri === "/update-order.json") {
        updateOrderJson(request, response);
      }
      else if (uri === "/remove-inventory.json") {
        removeInventoryJson(request, response);
      }
      else {
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.write("404 Not Found\n");
        response.end();
      }
      return;
    }

    if (fs.statSync(filename).isDirectory()) filename += "/index.html";

    fs.readFile(filename, "binary", function(err, file) {
      if(err) {
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
      }

      response.writeHead(200);
      response.write(file, "binary");
      response.end();
    });
  });
}).listen(parseInt(port, 10));

function inventoryJson(request, response) {
  // TODO: load inventory from database
  var connection = mysql.createConnection({
    host     : "db.it.pointpark.edu",
    user     : "foodpantry",
    password : "f5gkaHeUXqTzL8kq",
    database : "foodpantry"
  });
  connection.connect();
  connection.query("SELECT * FROM INVENTORY", function(err, rows, fields) {
    var json = {};
    if (err) {
      json["success"] = false;
      json["message"] = "Query failed: " + err;
    }
    else {
      //UNCOMMENT TO SEE ON WEBPAG
      json["success"] = true;
      json["message"] = "Query successful";
      json["data"] = rows;
    }
    response.writeHead(200, {"Content-Type": "text/json"});
    response.write(JSON.stringify(json));
    response.end();
  });
  connection.end();
}

function updateInventoryJson(request, response) {
  if (request.method === "POST") {
    var body = "";
    request.on("data", function (data) {
      body += data;
      // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
      if (body.length > 1e6) {
        // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
        request.connection.destroy();
      }
    });
    request.on("end", function () {
      var json = qs.parse(body);
      var connection = mysql.createConnection({
        host     : "db.it.pointpark.edu",
        user     : "foodpantry",
        password : "f5gkaHeUXqTzL8kq",
        database : "foodpantry"
      });
      connection.connect();
      // THIS IS LINE 95 FROM NOTES
      connection.query("INSERT INTO INVENTORY (FoodName, Count, FoodGroup, Description, DonorName, DonorOrganization, DonorPhone, DonorEmail, OrderDate, AdditonalNotes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [json["FoodName"], json["Count"], json["FoodGroup"], json["Description"], json["DonorName"], json["DonorOrganization"], json["DonorPhone"], json["DonorEmail"], json["OrderDate"], json["AdditonalNotes"]], function(err, rows, fields) {
        var json = {};
        if (err) {
          json["success"] = false;
          json["message"] = "Query failed: " + err;
        }
        else {
          json["success"] = true;
          json["message"] = "Query successful";
        }
        response.writeHead(200, {"Content-Type": "text/json"});
        response.write(JSON.stringify(json));
        response.end();
      });
      connection.end();
    });
  }
}

// Order
function orderJson(request, response) {
  // TODO: load inventory from database
  var connection = mysql.createConnection({
    host     : "db.it.pointpark.edu",
    user     : "foodpantry",
    password : "f5gkaHeUXqTzL8kq",
    database : "foodpantry"
  });
  connection.connect();
  connection.query("SELECT * FROM foodpantry.ORDER", function(err, rows, fields) {
    var json = {};
    if (err) {
      json["success"] = false;
      json["message"] = "Query failed: " + err;
    }
    else {
      //UNCOMMENT TO SEE ON WEBPAG
      json["success"] = true;
      json["message"] = "Query successful";
      json["data"] = rows;
    }
    response.writeHead(200, {"Content-Type": "text/json"});
    response.write(JSON.stringify(json));
    response.end();
  });
  connection.end();
}

// Update Order
function updateOrderJson(request, response) {
  if (request.method === "POST") {
    var body = "";
    request.on("data", function (data) {
      body += data;
      // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
      if (body.length > 1e6) {
        // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
        request.connection.destroy();
      }
    });
    request.on("end", function () {
      var json = qs.parse(body);
      var connection = mysql.createConnection({
        host     : "db.it.pointpark.edu",
        user     : "foodpantry",
        password : "f5gkaHeUXqTzL8kq",
        database : "foodpantry"
      });
      connection.connect();
      // THIS IS LINE 95 FROM NOTES
      connection.query("INSERT INTO foodpantry.ORDER (STUDENT_ID, DATE) VALUES (?, ?)", [json["studentId"], json["orderDate"]], function(err, rows, fields) {
console.log(err);
        var json = {};
        if (err) {
          json["success"] = false;
          json["message"] = "Query failed: " + err;
        }
        else {
          json["success"] = true;
          json["message"] = "Query successful";
        }
        response.writeHead(200, {"Content-Type": "text/json"});
        response.write(JSON.stringify(json));
        response.end();
      });
      connection.end();
    });
  }
}

/*
// Update Order Item
function updateOrderItemsJson(request, response) {
  if (request.method === "POST") {
    var body = "";
    request.on("data", function (data) {
      body += data;
      // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
      if (body.length > 1e6) {
        // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
        request.connection.destroy();
      }
    });
    request.on("end", function () {
      var json = qs.parse(body);
      var connection = mysql.createConnection({
        host     : "db.it.pointpark.edu",
        user     : "foodpantry",
        password : "f5gkaHeUXqTzL8kq",
        database : "foodpantry"
      });
      connection.connect();
      connection.query("INSERT INTO foodpantry.ORDER_ITEM (ORDER_ID, INVENTORY_ID) VALUES (?, ?)", [json["orderID"], json["inventoryID"]], function(err, rows, fields) {
console.log(err);
        var json = {};
        if (err) {
          json["success"] = false;
          json["message"] = "Query failed: " + err;
        }
        else {
          json["success"] = true;
          json["message"] = "Query successful";
        }
        response.writeHead(200, {"Content-Type": "text/json"});
        response.write(JSON.stringify(json));
        response.end();
      });
      connection.end();
    });
  }
}
*/

function removeInventoryJson(request, response) {
  if (request.method === "POST") {
    var body = "";
    request.on("data", function (data) {
      body += data;
      // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
      if (body.length > 1e6) {
        // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
        request.connection.destroy();
      }
    });
    request.on("end", function () {
      var json = qs.parse(body);
      var connection = mysql.createConnection({
        host     : "db.it.pointpark.edu",
        user     : "foodpantry",
        password : "f5gkaHeUXqTzL8kq",
        database : "foodpantry"
      });
      connection.connect();
      // THIS IS LINE 95 FROM NOTES
      //connection.query("DELETE FROM foodpantry.INVENTORY WHERE (FoodName, Count, FoodGroup, Description, DonorName, DonorOrganization, DonorPhone, DonorEmail, OrderDate, AdditonalNotes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [json["FoodName"], json["Count"], json["FoodGroup"], json["Description"], json["DonorName"], json["DonorOrganization"], json["DonorPhone"], json["DonorEmail"], json["OrderDate"], json["AdditonalNotes"]], function(err, rows, fields) {
      //connection.query("DELETE FROM foodpantry.INVENTORY WHERE (ID) VALUES (?)", [3], function(err, rows, fields) {
      connection.query("DELETE FROM foodpantry.INVENTORY WHERE ID='207'", [json["ID"]], function(err, rows, fields) {
        console.log(err);
        var json = {};
        if (err) {
          json["success"] = false;
          json["message"] = "Query failed: " + err;
        }
        else {
          json["success"] = true;
          json["message"] = "Query successful";
        }
        response.writeHead(200, {"Content-Type": "text/json"});
        response.write(JSON.stringify(json));
        response.end();
      });
      connection.end();
    });
  }
}

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");
