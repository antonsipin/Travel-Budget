const React = require('react')
const Layout = require('./Layout')

const NotFound = ({ username }) => {
    return (
        <Layout username={username}>
            <div className="container">
                <h2>
                    <div className="row">
                        <div className="card-panel green lighten-3">
                            <p>Sorry, we couldn't find what you were looking for.</p>
                        </div>
                    </div>
                </h2>
                </div>
        </Layout>
    )
}

module.exports = NotFound