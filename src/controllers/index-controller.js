const Home = require('../views/Home')
const { getHtml, docType } = require('../utils/index')

const index = (req, res) => {
  try {
    res.write(docType)
    res.end(getHtml(Home, {
      title: 'Travel Budget',
      userName: req.session?.user?.name || '',
      error: ''
    }))
  } catch (e) {
    console.log(e.message)
  }
}

module.exports = {
  index
}
