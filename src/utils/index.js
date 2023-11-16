require('dotenv').config()
const ReactDomServer = require('react-dom/server')
const React = require('react')

function getHtml (reactComponent, { ...args }) {
    const reactElement = React.createElement(reactComponent, {
      ...args
    })
    const html = ReactDomServer.renderToStaticMarkup(reactElement)
    return html
  }

 const docType = '<!DOCTYPE html>'

 const imgUrl = 'https://happay.com/blog/wp-content/uploads/sites/12/2023/05/capital-budgeting.webp'

 function getMailUrl (id) {
  return `http://${process.env.HOST}:${process.env.PORT}/newtrip/${id}`
 }

 function getChartSourceLink (result, resultCost, sum) {
    return `https://quickchart.io/chart?c={type:'doughnut',data:{labels:[${result}],datasets:[{data:[${resultCost}]}]},options:{plugins:{doughnutlabel:{labels:[{text:'${sum}',font:{size:20}},{text:'total'}]}}}}`
 }

 function getId(max = 10000) {
  return Math.floor(Math.random() * max);
}

function getLetterHtml (imgUrl, URL, tripName, users) {
  return `<div style="opacity: 0.7; background-image: url(${imgUrl}); height: 250px; width: 100%"> 
  <p style="font-weight: 800; margin: 20px 0 0 20px; color: rgb(0, 28, 140); display:flex; justify-content:center; font-size: 1.3rem">Hello from Travel Budget!</p></br>
  <p style="font-weight: 800; opacity: 1; margin: 50px 0 0 20px; color: rgb(0, 28, 140); font-size: 1.3rem">We have prepared a report about your <a href="${URL}">${tripName}</a> trip in which ${users} traveled.</p></br>
  <form action=${URL} method="GET">
  <button action=${URL} method="GET" type="submit" style="opacity: 1; margin: 50px 0 0 0; cursor: pointer; font-weight: 800; background-color: blue; color: white; height: 2.5rem; width: 100%; border-radius: 8px">Get the ${tripName} trip report</button>
  </form>
  </div>`
}

  module.exports = {
    getChartSourceLink,
    getLetterHtml,
    getHtml,
    docType,
    getId,
    imgUrl,
    getMailUrl
  }