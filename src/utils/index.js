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

 function getChartSourceLink (result, resultCost, sum) {
    return `https://quickchart.io/chart?c={type:'doughnut',data:{labels:[${result}],datasets:[{data:[${resultCost}]}]},options:{plugins:{doughnutlabel:{labels:[{text:'${sum}',font:{size:20}},{text:'total'}]}}}}`
 }

 function getId(max = 10000) {
  return Math.floor(Math.random() * max);
}

  module.exports = {
    getChartSourceLink,
    getHtml,
    docType,
    getId
  }