const Home = require('../views/Home')

const index = (req, res) => {
  try {
    const { user } = req.session

    res.renderComponent(Home, {
      title: 'Travel Budget',
      username: user?.name || '',
    })
  } catch (e) {
    console.log(e)
  }
}

module.exports = {
  index
}
