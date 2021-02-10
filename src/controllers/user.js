const User = require("../models/User");
const errorHandler = require("../utils/errorHandler");

module.exports.saveUser = async function (req, res) {
  const candidate = await User.findOne({
    id: req.body.id,
  });

  if (candidate) {
    const user = await User.findOne({ id: req.body.id });
    res.status(200).json({
      id: user.id,
      name: user.name,
      phone: user.phone ? user.phone : null,
      location: user.location
        ? {
            latitude: user.location.latitude,
            longitude: user.location.longitude,
          }
        : null,
    });
  } else {
    const user = new User({
      id: req.body.id,
      name: req.body.name,
    });
    if (req.body.phone) {
      user.phone = req.body.phone;
    }
    if (req.body.location) {
      user.location = req.body.location;
    }
    try {
      await user.save();
      res.status(201).json(user);
    } catch (error) {
      errorHandler(error, res);
    }
  }
};
module.exports.updateUser = async function (req, res) {
  const candidate = await User.findOne({
    id: req.body.id,
  });
  console.log(candidate);
  if (candidate) {
    if (req.body.phone) {
      await User.updateOne({
        id: req.body.id
      },
        {
          phone: req.body.phone,
        }
      );
    } 
    if (req.body.location) {
        await User.updateOne(
          {
            id: req.body.id
          },
          {
            location: req.body.location,
          }
        );
    }
  } else {
    res.status(404).json({
      message: "User not found",
    });
  }
};

module.exports.getUser = async function (req, res) {
    try {
        const candidate = await User.findOne({
            id: +req.params.id,
          });
          if (candidate) {
            res.status(200).json(candidate)
          } else {
            res.status(404).json({
              message: "User not found",
            });
          }
    } catch (error) {
        errorHandler(error, res)
    }
};
