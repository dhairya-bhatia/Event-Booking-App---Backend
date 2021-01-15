const { dateToString } = require("../../helpers/date");
const Event = require("../../models/events");
const User = require("../../models/user");

const tranformEvent = (event) => {
  return {
    ...event._doc,
    date: dateToString(event._doc.date),
    creator: fetchUserById.bind(this, event.creator),
  };
};

const transformBooking = (booking) => {
  return {
    ...booking._doc,
    user: fetchUserById.bind(this, booking._doc.user),
    event: fetchSingleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt),
  };
};

const fetchUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      createdEvents: fetchEventsById.bind(this, user._doc.createdEvents),
    };
  } catch (error) {
    throw error;
  }
};

const fetchEventsById = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map((event) => {
      return tranformEvent(event);
    });
  } catch (error) {
    throw error;
  }
};

const fetchSingleEvent = async (eventId) => {
  try {
    const event = await Event.findById(eventId);
    return tranformEvent(event);
  } catch (error) {
    throw error;
  }
};

module.exports = { tranformEvent, transformBooking };
