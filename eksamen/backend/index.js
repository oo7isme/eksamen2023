const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const db =
  "mongodb+srv://patchayawong85:1NejKtjPixlWA2QB@cluster0.tunhvkh.mongodb.net/eksamen";
const port = 25584;
app.use(express.json());

mongoose.connect(db, {});

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      callback(null, true);
    } else {
      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:25584",
      ];
      const isAllowed = allowedOrigins.includes(origin);
      callback(isAllowed ? null : new Error("Origin not allowed"), isAllowed);
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  fornavn: {
    type: String,
  },
  etternavn: {
    type: String,
  },
  adresse: {
    type: String,
  },
  postnummer: {
    type: String,
  },
  poststed: {
    type: String,
  },
  batplass: {
    type: String,
  },
  status: {
    type: String,
  },
  admin: {
    type: Boolean,
  },
});
const User = mongoose.model("Users", UserSchema);

app.post("/register", (req, res) => {
  // check if user already exists
  User.findOne({ email: req.body.email })
    .then((existingUser) => {
      if (existingUser) {
        // user already exists
        res.status(409).send({
          message: "User already exists",
        });
      } else {
        // hash the password
        bcrypt
          .hash(req.body.password, 10)
          .then((hashedPassword) => {
            // create a new user instance and collect the data
            const user = new User({
              email: req.body.email,
              password: hashedPassword,
              fornavn: req.body.fornavn,
              etternavn: req.body.etternavn,
              adresse: "",
              postnummer: "",
              poststed: "",
              batplass: "",
              status: "",
              admin: req.body.admin,
            });

            // save the new user
            user
              .save()
              // return success if the new user is added to the database successfully
              .then((result) => {
                res.send({
                  message: "User Created Successfully",
                  result,
                });
              })
              // catch error if the new user wasn't added successfully to the database
              .catch((error) => {
                res.send({
                  message: "Error creating user",
                  error,
                });
              });
          })
          // catch error if the password hash isn't successful
          .catch((e) => {
            res.status(401).send({
              message: "Password was not hashed successfully",
              e,
            });
          });
      }
    })
    // catch error if finding existing user fails
    .catch((error) => {
      res.status(401).send({
        message: "Error finding existing user",
        error,
      });
    });
});
// login endpoint
app.post("/login", (req, res) => {
  // check if email exists
  User.findOne({ email: req.body.email })

    // if email exists
    .then((user) => {
      // compare the password entered and the hashed password found
      bcrypt
        .compare(req.body.password, user.password)
        // if the passwords match
        .then((passwordCheck) => {
          // check if password matches
          if (!passwordCheck) {
            return res.send({
              message: "Passwords does not match",
            });
          }
          //   create JWT token
          const token = jwt.sign(
            {
              userId: user._id,
              userEmail: user.email,
            },
            "RANDOM-TOKEN",
            { expiresIn: "24h" }
          );

          //   return success res
          res.send({
            message: "Login Successful",
            userId: user._id,
            email: user.email,
            admin: user.admin,
            token,
          });
        })
        // catch error if password does not match
        .catch(() => {
          res.status(401).send({
            message: "Passwords do not match",
          });
        });
    })
    // catch error if email does not exist
    .catch(() => {
      res.status(401).send({
        message: "Email not found",
      });
    });
});
app.get("/getDataUser/:userId", (req, res) => {
  // retrieve the user ID from the request parameters
  const userId = req.params.userId;

  // retrieve the user data from the database using Mongoose
  User.findById(userId)
    .exec()
    .then((user) => {
      if (!user) {
        res.status(404).json({ error: "User not found" });
      } else {
        res.json(user);
      }
    })
    .catch((err) => {
      res.status(500).json({ error: "Error retrieving user data" });
    });
});
app.get("/users", (req, res) => {
  // Retrieve all users from the database, excluding admin
  User.find({ admin: false })
    .then((users) => {
      res.json(users);
    })
    .catch((error) => {
      res.status(500).json({ error: "Error retrieving user list" });
    });
});
app.put("/updateUser/:userId", (req, res) => {
  // retrieve the user ID from the request parameters
  const userId = req.params.userId;
  const updatedUserData = req.body;

  // update the user data in the database using Mongoose
  User.findByIdAndUpdate(userId, updatedUserData, { new: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        res.status(404).json({ error: "User not found" });
      } else {
        res.json(updatedUser);
      }
    })
    .catch((err) => {
      res.status(500).json({ error: "Error updating user data" });
    });
});
app.delete("/users/:userId", (req, res) => {
  const userId = req.params.userId;

  User.findByIdAndDelete(userId)
    .then((deletedUser) => {
      if (!deletedUser) {
        res.status(404).json({ error: "User not found" });
      } else {
        res.json({ message: "User deleted successfully" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: "Error deleting user" });
    });
});
app.post("/registerUser", (req, res) => {
  // Check if required fields are filled
  if (
    !req.body.email ||
    !req.body.password ||
    !req.body.fornavn ||
    !req.body.etternavn
  ) {
    return res.status(400).send({
      message: "Email, password, first name, and last name are required fields",
    });
  }

  // check if user already exists
  User.findOne({ email: req.body.email })
    .then((existingUser) => {
      if (existingUser) {
        // user already exists
        res.status(409).send({
          message: "User already exists",
        });
      } else {
        // hash the password
        bcrypt
          .hash(req.body.password, 10)
          .then((hashedPassword) => {
            // create a new user instance and collect the data
            const user = new User({
              email: req.body.email,
              password: hashedPassword,
              fornavn: req.body.fornavn,
              etternavn: req.body.etternavn,
              adresse: req.body.adresse || "",
              postnummer: req.body.postnummer || "",
              poststed: req.body.poststed || "",
              batplass: req.body.batplass || "",
              status: req.body.status || "",
              admin: req.body.admin || false,
            });

            // save the new user
            user
              .save()
              // return success if the new user is added to the database successfully
              .then((result) => {
                res.send({
                  message: "User Created Successfully",
                  result,
                });
              })
              // catch error if the new user wasn't added successfully to the database
              .catch((error) => {
                res.send({
                  message: "Error creating user",
                  error,
                });
              });
          })
          // catch error if the password hash isn't successful
          .catch((e) => {
            res.status(401).send({
              message: "Password was not hashed successfully",
              e,
            });
          });
      }
    })
    // catch error if finding existing user fails
    .catch((error) => {
      res.status(401).send({
        message: "Error finding existing user",
        error,
      });
    });
});
app.get("/admins", (req, res) => {
  // Retrieve all admins from the database
  User.find({ admin: true })
    .then((admins) => {
      res.json(admins);
    })
    .catch((error) => {
      res.status(500).json({ error: "Error retrieving admin list" });
    });
});
app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});
