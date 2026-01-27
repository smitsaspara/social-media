import User from "../models/User.js";
import Post from "../models/Post.js";

const SAFE_USER_SELECT =
  "_id firstName lastName picturePath friends location occupation twitterUrl linkedinUrl viewedProfile impressions";

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const isSelf = req.user?.id === id;
    const user = await User.findById(id).select(
      `${SAFE_USER_SELECT}${isSelf ? " email" : ""}`
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
  
      const friends = await Promise.all(
        user.friends.map((id) => User.findById(id))
      );

      const formattedFriends = friends.map(
        ({ _id, firstName, lastName, occupation, location, picturePath }) => {
          return { _id, firstName, lastName, occupation, location, picturePath };
        }
      );
      res.status(200).json(formattedFriends);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
};


export const addRemoveFriend = async (req, res) => {
    try {
      const { id, friendId } = req.params;
      if (!req.user || req.user.id !== id) {
        return res.status(403).json({ message: "You can only update your friends list." });
      }
      if (id === friendId) {
        const user = await User.findById(id);
        if (!user) {
          return res.status(404).json({ message: "User not found." });
        }
        user.friends = (user.friends || []).filter((friend) => friend !== id);
        await user.save();
        const friends = await Promise.all(
          user.friends.map((friend) => User.findById(friend))
        );
        const formattedFriends = friends.map(
          ({ _id, firstName, lastName, occupation, location, picturePath }) => {
            return { _id, firstName, lastName, occupation, location, picturePath };
          }
        );
        return res
          .status(400)
          .json({ message: "You cannot add yourself as a friend.", friends: formattedFriends });
      }
      const user = await User.findById(id);
      const friend = await User.findById(friendId);
      if (!user || !friend) {
        return res.status(404).json({ message: "User not found." });
      }
  
      if (user.friends.includes(friendId)) {
        user.friends = user.friends.filter((friend) => friend !== friendId);
        friend.friends = friend.friends.filter((friend) => friend !== id);
      } else {
        user.friends.push(friendId);
        friend.friends.push(id);
      }
      await user.save();
      await friend.save();
  
      const friends = await Promise.all(
        user.friends.map((id) => User.findById(id))
      );
      const formattedFriends = friends.map(
        ({ _id, firstName, lastName, occupation, location, picturePath }) => {
          return { _id, firstName, lastName, occupation, location, picturePath };
        }
      );
  
      res.status(200).json(formattedFriends);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
};

export const searchUsersByFirstName = async (req, res) => {
  try {
    const { firstName } = req.query;

    if (!firstName || !firstName.trim()) {
      return res.status(400).json({ message: "firstName query is required." });
    }

    const escaped = firstName.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const users = await User.find({
      firstName: { $regex: escaped, $options: "i" },
    })
      .select("_id firstName lastName picturePath location occupation")
      .limit(10);

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user || req.user.id !== id) {
      return res.status(403).json({ message: "You can only update your profile." });
    }

    const {
      firstName,
      lastName,
      location,
      occupation,
      twitterUrl,
      linkedinUrl,
    } = req.body;

    const updates = {
      firstName: (firstName || "").trim(),
      lastName: (lastName || "").trim(),
      location: (location || "").trim(),
      occupation: (occupation || "").trim(),
      twitterUrl: (twitterUrl || "").trim(),
      linkedinUrl: (linkedinUrl || "").trim(),
    };

    const isValidUrl = (value, allowedHosts) => {
      if (!value) return true;
      try {
        const url = new URL(value);
        if (!["http:", "https:"].includes(url.protocol)) return false;
        const host = url.hostname.replace(/^www\./, "").toLowerCase();
        return allowedHosts.includes(host);
      } catch (error) {
        return false;
      }
    };

    if (!updates.firstName || !updates.lastName) {
      return res
        .status(400)
        .json({ message: "First name and last name are required." });
    }

    if (
      !isValidUrl(updates.twitterUrl, ["twitter.com", "x.com"]) ||
      !isValidUrl(updates.linkedinUrl, ["linkedin.com"])
    ) {
      return res.status(400).json({
        message:
          "Provide valid Twitter/X and LinkedIn profile URLs, or leave them empty.",
      });
    }

    const user = await User.findByIdAndUpdate(id, updates, {
      new: true,
      select: `${SAFE_USER_SELECT} email`,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    await Post.updateMany(
      { userId: id },
      {
        firstName: user.firstName,
        lastName: user.lastName,
        location: user.location,
      }
    );

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};