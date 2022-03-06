const { User, Thought } = require('../models');

module.exports = {
  getUsers(req, res) {
    User.find()
      .select('-__v')
      .populate("thoughts")
      .populate("friends")
      .then((users) => res.json(users))
      .catch((err) => {
        console.log('err', err)
        res.status(500).json(err)
      });
  },

  getSingleUser(req, res) {
    console.log('singleuser', req.params)
    User.findOne({ _id: req.params.userId })
      .select('-__v')
      .populate("thoughts")
      .populate("friends")
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json(user)
      )
      .catch((err) => {
        console.log('err', err)
        res.status(500).json(err)
      });
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
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with this id!' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Delete existing User
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : Thought.deleteMany({ _id: { $in: user.thoughts } })
      )
      .then(() => res.json({ message: 'User and thoughts deleted!' }))
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