const React = require('react')
const Layout = require('./Layout')

const Mail = ({ userName }) => {
    return (
        <Layout userName={userName}>
            <div className="container">
                <h2>
                    Send report
                </h2> 
                <br />

                <form 
                    name="mailForm" 
                    method="POST" 
                    action="/mail" 
                    id="mailForm"
                >
                    <button 
                        id="sendMailBtn" 
                        formAction="/mail" 
                        formMethod="post" 
                        className="btn btn-primary" 
                        type="submit"
                        value="Pay castomize">
                            Send report by email
                    </button>
                </form>
            </div>
        </Layout>
    )
}

module.exports = Mail