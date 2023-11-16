const React = require('react')
const ReactDomServer = require('react-dom/server')

function renderComponent (reactComponent, props = {}, options = { doctype: true }) {

    const reactElement = React.createElement(reactComponent, {
        ...this.app.locals,
        ...this.locals,
        ...props
    })

    const html = ReactDomServer.renderToStaticMarkup(reactElement)

    if (options.doctype) {
        this.write('<!DOCTYPE html>')
    }
    
    this.end(html)
}

function ssr (req, res, next) {
    res.renderComponent = renderComponent
    next()
}

module.exports = ssr

