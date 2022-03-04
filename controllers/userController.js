const { User, Thought } = require('../models');

module.exports = {
  getUsers(req, res) {
    User.find()
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.id })
      .select('-__v')
      .populate('friends')
      .populate('thoughts')
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // create a new user
  createUser(req, res) {
    User.create(req.body)
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.status(500).json(err));
  },

 // Update existing User
 updateUser(req, res) {
  User.findOneAndUpdate(
      { _id: req.params.id },
      {
          username: req.body.username,
          email: req.body.email
      },
      { new: true })
  .then((user) => res.json(user))
  .catch((err) => res.status(500).json(err));
},

// Delete existing User
deleteUser(req, res) {
  User.findOneAndDelete({ _id: req.params.id })
  .then((user) =>
    !user
      ? res.status(404).json({ message: 'No thought with that ID' })
      : Thought.deleteMany({ _id: { $in: user.thoughts } })
  )
  .then(() => res.json({ message: 'User and thoughts have been deleted' }))
  .catch((err) => res.status(500).json(err));
},

 // Add Friend to User
 addFriend(req, res) {
  User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { new: true })
  .then((user) => res.json(user))
  .catch((err) => res.status(500).json(err));
},

// Delete Friend to User
deleteFriend(req, res) {
  User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true })
  .then((user) => res.json(user))
  .catch((err) => res.status(500).json(err));
}
}