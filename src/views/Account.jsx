const React = require('react')
const Layout = require('./Layout')

const Account = ({ username }) => {
    return (
        <Layout username={username}>
            <div className="container">
                <div className="row">
                    <div className="col-s-12">
                        <div className="account">
                            <p className="interval"> 
                                <a className="useraccount" href="/accounts">
                                    {username}, welcome to your account !
                                </a>
                            </p>
                        </div>
                        <br />

                        <div className="account">
                            <p className="interval splitbills"> 
                            Split bills.
                            We tell you who owes whom and how to settle debts in groups
                            Click on New Trip or view all trips
                            </p>
                        </div>

                        <div className="account">
                            <form 
                            className="acc-btn col-3 col-s-12" 
                            action="/trips">
                                <button 
                                    className="waves-effect waves-light btn-large nav-wrapper green lighten-3">
                                        New Trip
                                </button>
                            </form>

                            <form className="acc-btn col-3 col-s-12" 
                            action="/trips/allTrips">
                                <button 
                                    className="waves-effect waves-light btn-large nav-wrapper green lighten-3">
                                        All Trips
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

module.exports = Account