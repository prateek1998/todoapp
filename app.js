const express = require("express");
const mysql = require("mysql");
const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
const connection = mysql.createConnection({
  host: "sql12.freemysqlhosting.net",
  user: "sql12341681",
  password: "ktKyxtzk2q",
  database: "sql12341681",
  port: "3306",
  multipleStatements: true,
});

connection.connect((err) => {
  if (err) {
    console.log("error connecting: " + err.stack);
    return;
  }
  console.log("success");
});

app.get("/", (req, res) => {
  res.render("top.ejs");
});

// SET @id:= 0;UPDATE items SET id = @id := (@id+1);ALTER TABLE items AUTO_INCREMENT = 1;
app.get("/index", (req, res) => {
  connection.query("SELECT * FROM items;", (error, results) => {
    console.log(results);
    res.render("index.ejs", { items: results });
  });
});

app.get("/new", (req, res) => {
  res.render("new.ejs");
});

app.post("/create", (req, res) => {
  connection.query(
    "INSERT INTO items (name) VALUES (?)",
    [req.body.itemName],
    (error, results) => {
      res.redirect("/index");
    }
  );
});

app.post("/delete/:id", (req, res) => {
  connection.query(
    "DELETE FROM items WHERE id = ?;SET @id:= 0;UPDATE items SET id = @id := (@id+1);ALTER TABLE items AUTO_INCREMENT = 1;",
    [req.params.id],
    (error, results) => {
      res.redirect("/index");
    }
  );
});

app.get("/demo", (req, res) => {
  res.render("demo.ejs");
});

app.get("/edit/:id", (req, res) => {
  connection.query(
    "SELECT * FROM items WHERE id = ?",
    [req.params.id],
    (error, results) => {
      res.render("edit.ejs", { item: results[0] });
    }
  );
});

app.post("/update/:id", (req, res) => {
  // Write code to update the selected item
  connection.query(
    "UPDATE items SET name = ? WHERE id = ?",
    [req.body.itemName, req.params.id],
    (error, results) => {
      res.redirect("/index");
    }
  );
  // Delete the following redirect to the list page
});

app.listen(process.env.PORT || 3000);
