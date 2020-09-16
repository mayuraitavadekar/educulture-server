const User = require("../models/user");
const shortid = require("shortid");
const crypto = require("crypto");
const sgMail = require("@sendgrid/mail");
const jwt = require("jsonwebtoken");
const expressjwt = require("express-jwt");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.register = (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  let mobile = req.body.mobile;

  console.log("route hit = /register");

  // generate the 6 digit password here
  const plainpassword = shortid.generate();

  // encrypt the password
  const password = crypto
    .createHmac("sha256", process.env.SECRET)
    .update(plainpassword)
    .digest("hex");

  // save info in DB
  let user = new User({
    name: name,
    email: email,
    mobile: mobile,
    password: password,
  });

  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        error: "not able to save in DB",
      });
    }

    // send the password to user's email account
    const msg = {
      to: `${user.email}`,
      from: "educulture.edtech@gmail.com",
      subject: "Educulture[Registration]",
      text: "This is system generated email. Please do not reply.",
      html: `<p>Your login code for educulture account is ${plainpassword}</p>
        <br>
        <p>Keep this login code safe. If you're getting any error in login kindly mail us at 
        <b>educulture.edtech@gmail.com</b>
        </p>
        `,
    };

    sgMail.send(msg);

    return res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
    });
  });
};

exports.login = (req, res) => {
  let email = req.body.email;
  let plainpassword = req.body.password;

  console.log("route hit = /login");

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "Email is not available.",
      });
    }

    // password
    const password = crypto
      .createHmac("sha256", process.env.SECRET)
      .update(plainpassword)
      .digest("hex");

    if (password === user.password) {
      let token = jwt.sign({ _id: user._id }, process.env.SECRET);
      // put token into user cookie
      res.cookie("token", token, {
        path: "/",
        expire: new Date(Date.now() + 60 * 60 * 24 * 1000 * 1),
      });

      const { _id, name, email, role } = user;

      // final return
      return res.json({
        token,
        user: { _id, name, email, role },
        //cookiesetted: req.cookies["token"],
        //decodedcookietoken: jwt_decode(req.cookies["token"]), run for every new token
      });
    } else {
      return res.status(400).json({
        error: "Password does not match.",
      });
    }
  });
};

exports.signout = (req, res) => {
  // simply clear the cookies
  res.clearCookie("token");
  return res.json({
    message: "user signout successfully",
  });
};

exports.isSignIn = expressjwt({
  secret: process.env.SECRET,
  algorithms: ["HS256"],
  userProperty: "auth",
});

exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.json(403).json({
      error: "not authenticated. access denied.",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "not admin. access denied.",
    });
  }
  next();
};
