require("dotenv").config();
var express = require("express");
var cors = require("cors");
var morgan = require("morgan");
var bookRoute = require("./Routes/BooksRoute");

var app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

app.use("/", bookRoute);

app.use((req, res, next) => {
  const error = new Error("Route Not Found");
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    },
  });
});

const port = process.env.PORT || 3001;
app.listen(port, (error) => {
  if (error) console.log(error);
  else console.log(`Server is listening on Port:${port}`);
});
