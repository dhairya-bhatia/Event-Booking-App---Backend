const Event = require("../../models/events");
const User = require("../../models/user");
const { tranformEvent } = require("./commonResolverHelpers");

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map((key) => {
        return tranformEvent(key);
      });
    } catch (err) {
      throw err;
    }
  },
  createEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: req.userId,
    });
    let createdEvent;
    try {
      const res = await event.save();
      createdEvent = tranformEvent(res);
      const user = await User.findById(req.userId);
      if (!user) {
        throw new Error("User does not exists");
      }
      user.createdEvents.push(event);
      await user.save();

      return createdEvent;
    } catch (err) {
      throw err;
    }
  },
};
