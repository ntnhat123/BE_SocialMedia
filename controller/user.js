import User from "../model/user.js";
const test = "test";

export const searchUsers = async (req, res) => {
  const { fullName, id } = req.query;
  console.log(id);
  try {
    const users = await User.find({
      fullName: { $regex: req.query.fullName, $options: "i" },
    })
      .find({ _id: { $ne: id } })
      .limit(5);
    res.status(200).json({
      status: true,
      data: users,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    res.status(200).json({
      status: true,
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

export const editUser = async (req, res) => {
  const { avatar, fullName, mobile, address, story, website } = req.body;
  const { id } = req.params;
  try {
    const newUser = await User.findByIdAndUpdate(
      id,
      { avatar, fullName, mobile, address, story, website },
      { new: true }
    );
    res.status(200).json({
      status: true,
      data: newUser,
    });
  } catch (err) {
    res.status(200).json({
      status: false,
      message: err.message,
    });
  }
};

// export const follow = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const user = await User.findById(id);
//     if (!user.followers.includes(req.userId)) {
//       await user.updateOne({ $push: { followers: req.userId } });
//       await user.save();
//       res.status(200).json("user has been followed");
//     } else {
//       await user.updateOne({ $pull: { followers: req.userId } });
//       await user.save();
//       res.status(200).json("user has been unfollowed");
//     }
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

export const follow = async (req, res) => {
  const { idUser, idUserFollow } = req.body;
  try {
    const user = await User.findById(idUserFollow);
    if (!user.followers.includes(idUser)) {
      const newUser = await User.findByIdAndUpdate(
        idUserFollow,
        {
          $push: { followers: idUser },
        },

        { new: true }
      );
      res.status(200).json({
        status: true,
        message: "Followed",
        data: newUser,
      });
    } else {
      const newUser = await User.findByIdAndUpdate(
        idUserFollow,
        { $pull: { followers: idUser } },
        { new: true }
      );
      res.status(200).json({
        status: true,
        message: "Unfollowed",
        data: newUser,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

export const unFollow = async (req, res) => {
  const { idUser, idUserFollow } = req.body;
  try {
    const userFollow = await User.findById(idUserFollow);
    const userCurrent = await User.findById(idUser);

    if (!userFollow.followers.includes(userCurrent._id)) {
      return res.status(200).json({
        status: true,
        message: "User is not being followed",
      });
    } else {
      userFollow.followers.pull(userCurrent._id);
      userCurrent.following.pull(userFollow._id);
      await userFollow.save();
      await userCurrent.save();
    }
    res.status(200).json({
      status: true,
      message: "Unfollowed",
      data: userFollow,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

export const getAllUser = async (req, res) => {
  const { id } = req.params;
  try {
    const users = await User.find({ _id: { $ne: id } })
      .select("-password")
      .limit(5);
    res.status(200).json({
      status: true,
      data: users,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};
