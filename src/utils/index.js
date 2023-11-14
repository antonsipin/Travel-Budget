const ReactDomServer = require('react-dom/server')
const React = require('react')

function getHtml (page, { title, error, userName }) {
    const reactElement = React.createElement(page, {
      title,
      error,
      userName
    })
    const html = ReactDomServer.renderToStaticMarkup(reactElement)
    return html
  }

 const docType = '<!DOCTYPE html>' 

  module.exports = {
    getHtml,
    docType
  }