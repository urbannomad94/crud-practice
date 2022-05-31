//Adding modules
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const MongoClient = require("mongodb").MongoClient;

//Setting view engine to ejs
app.set("view engine", "ejs");

//Connect to MongoDB database
MongoClient.connect(
  "mongodb+srv://aidanw4:CRUDmaster@cluster0.wkfbu.mongodb.net/?retryWrites=true&w=majority",
  {
    useUnifiedTopology: true,
  }
)
  .then((client) => {
    console.log("Connected to Database");
    const db = client.db("crud-practice");
    const quotesCollection = db.collection("quotes");
    //Using body-parser middleware to use data from form element
    app.use(bodyParser.urlencoded({ extended: true }));

    //Alows server to accept JSON data
    app.use(bodyParser.json());

    //Making 'public' folder accessible to public using static middleware
    app.use(express.static("public"));

    //Serving up html file
    app.get("/", (req, res) => {
      // res.sendFile(
      //   "/Users/aidanwilliams/repos/100Devs/projects/crud-practice/index.html"
      // );
      db.collection("quotes")
        .find()
        .toArray()
        .then((results) => {
          res.render("index.ejs", { quotes: results });
        })
        .catch((error) => console.error(error));
      // res.render("index.ejs", {});
    });

    app.put("/quotes", (req, res) => {
      quotesCollection
        .findOneAndUpdate(
          { name: "Yoda" },
          {
            $set: {
              name: req.body.name,
              quote: req.body.quote,
            },
          },
          {
            upsert: true,
          }
        )
        .then((result) => {
          // console.log(result);
          res.json("Success");
        })
        .catch((error) => console.error(error));
      // console.log(req.body);
    });

    //Adding data from form entry
    app.post("/quotes", (req, res) => {
      quotesCollection
        .insertOne(req.body)
        .then((result) => {
          res.redirect("/");
        })
        .catch((error) => console.error(error));
    });

    app.delete("/quotes", (req, res) => {
      quotesCollection
        .deleteOne({ name: req.body.name })
        .then((result) => {
          if (result.deletedCount === 0) {
            return res.json("No quote to delete");
          }
          res.json(`Deleted Darth Vadar's quote`);
        })
        .catch((error) => console.error(error));
    });

    //Sever is listening to localhost port 3000
    app.listen(3000, function () {
      console.log("listening on 3000");
    });
  })
  .catch(console.error);
