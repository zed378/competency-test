// init requirement
const http = require("http");
const express = require("express");
const hbs = require("hbs");
const path = require("path");
const dbConnection = require("./connection/db");
const session = require("express-session");
const uploadHelper = require("./middleware/uploadHelper");

// use express
const app = express();

// use request handler to parsing html form
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// set public path to store static web files
app.use(express.static("express"));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/upload", express.static(path.join(__dirname, "upload")));

// setting view engine
app.set("view engine", "hbs");

// registering view partial
hbs.registerPartials(path.join(__dirname, "views/partials"));
const uploadPath = "http://localhost:4000/upload/";

// use express-session to set user session
app.use(
  session({
    // set max session to 3 hours
    cookie: {
      maxAge: 3 * 60 * 60 * 1000,
      secure: false,
      httpOnly: true,
    },
    // save session to server memory
    store: new session.MemoryStore(),
    saveUninitialized: false,
    resave: false,
    secret: "secretValue",
  })
);

// accessing session data from memory store
app.use((req, res, next) => {
  res.locals.message = req.session.message;

  delete req.session.message;
  next();
});

// Set index view
app.get("/", function (req, res) {
  res.render("index", {
    title: "KotaKU",
  });
});

// Set province view
app.get("/prov", function (req, res) {
  const query = `SELECT * FROM provinsi_tb`;

  dbConnection.getConnection((err, conn) => {
    if (err) throw err;

    conn.query(query, (err, results) => {
      if (err) throw err;

      let prov = [];

      for (let result of results) {
        prov.push({
          ...result,
          img: uploadPath + result.photo,
        });
      }

      res.render("provinsi", {
        title: "Provinsi",
        prov,
      });
    });

    conn.release();
  });
});

app.get("/detailprov/:id", function (req, res) {
  const { id } = req.params;

  const query = `SELECT * FROM provinsi_tb WHERE id = ${id}`;

  dbConnection.getConnection((err, conn) => {
    if (err) throw err;

    conn.query(query, (err, results) => {
      if (err) throw err;

      const prov = {
        ...results[0],
        img: uploadPath + results[0].photo,
      };

      res.render("detailprov", {
        title: "Detail Provinsi",
        prov,
      });
    });

    conn.release();
  });
});

app.get("/addprov", function (req, res) {
  res.render("add/prov", {
    title: "Tambah Provinsi",
  });
});

app.post("/addprov", uploadHelper("image"), function (req, res) {
  const { name, date, pulau } = req.body;

  // catch image filename
  const image = req.file.filename;

  // hold query
  const query = `INSERT INTO provinsi_tb (nama, diresmikan, photo, pulau) VALUES ("${name}", "${date}", "${image}", "${pulau}")`;

  // verif if input is blank
  if (name == "" || date == "" || pulau == "") {
    req.session.message = {
      color: "red",
      message: "Input must be filled",
    };

    res.redirect("/addprov");
    return;
  }

  dbConnection.getConnection((err, conn) => {
    if (err) throw err;

    conn.query(query, (err, results) => {
      if (err) {
        res.redirect("/addprov");
      } else {
        req.session.message = {
          color: "green",
          message: "Province data succesfully add",
        };

        return res.redirect("/addprov");
      }
    });
    conn.release();
  });
});

app.get("/editprov/:id", function (req, res) {
  const { id } = req.params;

  const query = `SELECT * FROM provinsi_tb WHERE id = ${id}`;

  dbConnection.getConnection((err, conn) => {
    if (err) throw err;

    conn.query(query, (err, results) => {
      const prov = {
        ...results[0],
        img: uploadPath + results[0].photo,
      };

      console.log(results);

      res.render("edit/prov", {
        title: "Edit Data Provinsi",
        prov,
      });
    });

    conn.release();
  });
});

app.post("/editprov", uploadHelper("image"), function (req, res) {
  let { id, name, date, pulau, oldImage } = req.body;

  let image = oldImage.replace(uploadPath, "");

  if (req.file) {
    image = req.file.filename;
  }

  console.log(id);

  const query = `UPDATE provinsi_tb SET nama="${name}", diresmikan = "${date}", photo = "${image}", pulau = "${pulau}" WHERE id = ${id}`;

  dbConnection.getConnection((err, conn) => {
    if (err) {
      req.session.message = {
        color: "red",
        message: "Connection Error",
      };

      res.redirect(`/editprov/${id}`);
    }

    conn.query(query, (err, results) => {
      if (err) {
        req.session.message = {
          color: "red",
          message: "Update Data Failed",
        };

        res.redirect(`/editprov/${id}`);
      } else {
        req.session.message = {
          color: "green",
          message: "Data Successfully Update",
        };

        res.redirect(`/editprov/${id}`);
      }
    });

    conn.release();
  });
});

app.get("/delprov/:id", function (req, res) {
  const { id } = req.params;

  const query = `DELETE FROM provinsi_tb WHERE id = ${id}`;

  dbConnection.getConnection((err, conn) => {
    if (err) throw err;

    conn.query(query, (err, results) => {
      if (err) {
        req.session.message = {
          color: "red",
          message: err.sqlMessage,
        };
      } else {
        res.redirect("/prov");
      }
    });
    conn.release();
  });
});

// Set city view
app.get("/kota", function (req, res) {
  const query = `SELECT * FROM kabupaten_tb`;

  dbConnection.getConnection((err, conn) => {
    if (err) throw err;

    conn.query(query, (err, results) => {
      if (err) throw err;

      let kab = [];

      for (let result of results) {
        kab.push({
          ...result,
          img: uploadPath + result.photo,
        });
      }

      res.render("kota", {
        title: "Kota",
        kab,
      });
    });

    conn.release();
  });
});

app.get("/detailkota/:id", function (req, res) {
  const { id } = req.params;

  const query = `SELECT * FROM kabupaten_tb WHERE id = ${id}`;

  dbConnection.getConnection((err, conn) => {
    if (err) throw err;

    conn.query(query, (err, results) => {
      if (err) throw err;

      const kab = {
        ...results[0],
        img: uploadPath + results[0].photo,
      };

      res.render("detailkota", {
        title: "Detail Kota",
        kab,
      });
    });

    conn.release();
  });
});

app.get("/addkota", function (req, res) {
  res.render("add/kota", {
    title: "Tambah Kota",
  });
});

app.post("/addkota", uploadHelper("image"), function (req, res) {
  const { name, date, provinsi } = req.body;

  // catch image filename
  const image = req.file.filename;

  // hold query
  const query = `INSERT INTO kabupaten_tb (nama, diresmikan, photo, provinsi_id) VALUES ("${name}", "${date}", "${image}", "${provinsi}")`;

  // verif if input is blank
  if (name == "" || date == "" || provinsi == "") {
    req.session.message = {
      color: "red",
      message: "Input must be filled",
    };

    res.redirect("/addkota");
    return;
  }

  dbConnection.getConnection((err, conn) => {
    if (err) throw err;

    conn.query(query, (err, results) => {
      if (err) {
        res.redirect("/addkota");
      } else {
        req.session.message = {
          color: "green",
          message: "City data succesfully add",
        };

        return res.redirect("/addkota");
      }
    });
    conn.release();
  });
});

app.get("/editkota/:id", function (req, res) {
  const { id } = req.params;

  const query = `SELECT * FROM kabupaten_tb WHERE id = ${id}`;

  dbConnection.getConnection((err, conn) => {
    if (err) throw err;

    conn.query(query, (err, results) => {
      const kab = {
        ...results[0],
        img: uploadPath + results[0].photo,
      };

      res.render("edit/kota", {
        title: "Edit Data Kota",
        kab,
      });
    });

    conn.release();
  });
});

app.post("/editkota", uploadHelper("image"), function (req, res) {
  let { id, name, date, provinsi, oldImage } = req.body;

  let image = oldImage.replace(uploadPath, "");

  if (req.file) {
    image = req.file.filename;
  }

  console.log(id);

  const query = `UPDATE provinsi_tb SET nama="${name}", diresmikan = "${date}", photo = "${image}", pulau = "${provinsi}" WHERE id = ${id}`;

  dbConnection.getConnection((err, conn) => {
    if (err) {
      req.session.message = {
        color: "red",
        message: "Connection Error",
      };

      res.redirect(`/editkota/${id}`);
    }

    conn.query(query, (err, results) => {
      if (err) {
        req.session.message = {
          color: "red",
          message: "Update Data Failed",
        };

        res.redirect(`/editkota/${id}`);
      } else {
        req.session.message = {
          color: "green",
          message: "Data Successfully Update",
        };

        res.redirect(`/editkota/${id}`);
      }
    });

    conn.release();
  });
});

app.get("/delkota/:id", function (req, res) {
  const { id } = req.params;

  const query = `DELETE FROM kabupaten_tb WHERE id = ${id}`;

  dbConnection.getConnection((err, conn) => {
    if (err) throw err;

    conn.query(query, (err, results) => {
      if (err) {
        req.session.message = {
          color: "red",
          message: err.sqlMessage,
        };
      } else {
        res.redirect("/kota");
      }
    });
    conn.release();
  });
});

// setting port and server
const port = 4000;
const server = http.createServer(app);
server.listen(port);

console.debug(`Server running on port: ${port}`);
