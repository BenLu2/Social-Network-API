const { Schema, model } = require('mongoose');
const ReactionSchema = require('./Reaction');

// Schema to create Post model
const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    username: {
      type: String,
      required: true,
    },
    reaction: [ReactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

// Create a virtual property `responses` that gets the amount of response per thought
thoughtSchema
  .virtual('getReactions')
  // Getter
  .get(function () {
    return this.reaction.length;
  });

// Initialize our Thought model
const Thought = model('thought', thoughtSchema);

module.exports = Thought;
