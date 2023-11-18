const Home = require('../views/Home')

const index = (req, res) => {
  try {
    const { username } = res.locals

    res.renderComponent(Home, {
      title: 'Travel Budget',
      username,
    })
  } catch (e) {
    console.log(e)
  }
}

module.exports = {
  index
}
