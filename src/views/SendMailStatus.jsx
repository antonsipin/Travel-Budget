'use client'
const React = require('react')
const Layout = require('./Layout')
const Loader = require('./Loader')

const SendMailStatus = ({ userName, error, email, id, tripName, users }) => {
    const [secondEmail, setSecondEmail] = React.useState('')
    const [loaderStatus, setLoaderStatus] = React.useState(false)
    return (
        <Layout userName={userName}>
            <div className="container">
                {
                error ? 
                <div>
                    Something went wrong, the report was not sent to the {' '}{email}...
                </div>:
                <div className="account">
                <div className="col s12">
                    <br />
                    <h3 className="useraccount">
                        The report was successfully sent by email:{' '}{email}
                    </h3>
                </div>
            </div>
                }

                {loaderStatus && <Loader />}

                <form 
                    name="mailForm" 
                    method="POST" 
                    action="/mail" 
                    id="mailForm"
                >

                    <input 
                        required
                        type="email"
                        name="email"
                        onChange={(e) => setSecondEmail(e.target.value)} 
                        value={secondEmail} 
                        className="form-control" 
                        id="secondEmail"
                    />  

                    <input 
                        type="hidden"
                        name="tripName"
                        value={tripName} 
                        className="form-control" 
                        id="tripName"
                    />

                    <input 
                        type="hidden"
                        name="id"
                        value={id} 
                        className="form-control" 
                        id="id"
                    />

                    <input 
                        type="hidden"
                        name="users"
                        value={users} 
                        className="form-control" 
                        id="users"
                    />  

                    <button 
                        onClick={() => setLoaderStatus(true)}
                        id="sendMailBtn" 
                        formAction="/mail" 
                        formMethod="POST"
                        style={{
                            width: "100%",
                            height: "50px", 
                            margin: "15px 0 50px 0", 
                            borderRadius: "8px",
                            fontSize: "1.3rem",
                            fontWeight: "700"
                        }} 
                        className="btn btn-primary" 
                        type="submit">
                            Send the report again
                    </button>
                    
                    <br />
                </form>
                <br />
                    <form
                        name="toAccountForm" 
                        method="GET" 
                        action="/accountl" 
                        id="toAccountForm"
                    >
                        <button
                            formAction="/account" 
                            id="toAccountBtn" 
                            style={{
                                width: "100%",
                                height: "50px", 
                                margin: "15px 0 50px 0", 
                                borderRadius: "8px",
                                fontSize: "1.3rem",
                                fontWeight: "700"
                            }} 
                            className="btn btn-primary" 
                            type="submit">
                                Back to account
                        </button>
                    </form>    
            </div>
        </Layout>
    )
}

module.exports = SendMailStatus