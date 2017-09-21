import love from './tmp/main';

const cheese = () => {
  return "cheese";
}

const showLove = () => {
  return love;
}

module.exports = {
  cheese: cheese,
  love: showLove,
};
