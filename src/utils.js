exports.generateRandomNumberBetween = (low, up) =>
  Math.floor(Math.random() * (up - low) + low);

exports.getMissingElements = (mainArray, compareArray) =>
  compareArray.reduce(((acc, elem) => mainArray.some(dup => dup == elem) ? acc : acc.concat(elem)), []);

exports.updateArray = (original, data) => {
  let nodups = exports.getMissingElements(original, data);
  original.push(...nodups);
}

exports.addUntilLimit = (array, limit, element) => {
  exports.updateArray(array, [element]);
  if (array.length > limit) {
    array.shift()
  }
}

exports.userMention = userid => `<@${userid}>`;

exports.log = {
  promiseError: (from, to, context) => console.error(context.error),
  eventError: (event, state) => console.error(`unhandled event ${event} in state ${state}`)
}

exports.isHourWithinTolerance = (hour, tolerance) => {
  let date = new Date();
  let currentHour = date.getHours();
  currentHour += date.getMinutes() / 60.0;
  return hour - tolerance < currentHour == currentHour < hour + tolerance;
}

exports.compareLists = (list1, list2) =>
  list1.every(elem1 => list2.some(elem2 => elem1 === elem2))

exports.trimLists = (list1, list2) =>
  list1.filter(elem1 => !list2.some(elem2 => elem1 === elem2))

exports.getUserIdFromCommandArgument = text => {
  let tokens = text.split("|");
  let id = tokens[0].substring(2);
  if (id.length === 0) {
    throw "invalid userid"
  }
  return id;
}

exports.generateRandomInsult = (slurs, userid, users) => {
  let id = exports.generateRandomNumberBetween(0, slurs.length);
  return exports.formatTextTokens(slurs[id], userid, users);
}

exports.formatTextTokens = (text, userid, users) => {
  text = text.replace(/{user}/g, exports.userMention(userid))
  return text.replace(/{random}/g, exports.generateRandomUserMention(users, userid))
}

exports.reverseUserMention = (message) => {
  return message.replace(/<@[a-z0-9]*>/gi, '{user}')
}

exports.getDeletedSlursMessage = (slurs) => {
  return [{
    "fallback": "The following slurs have been cleaned up",
    "color": "#e05f28",
    "pretext": "The following slurs have been cleaned up",
    "fields": slurs.map(slur => ({
      "title": slur,
      "short": false
    }))
  }]
}

exports.generateRandomUserMention = (users, userid) => {
  users = users.filter(elem => elem !== userid);
  let id = exports.generateRandomNumberBetween(0, users.length);
  return exports.userMention(users[id]);
}