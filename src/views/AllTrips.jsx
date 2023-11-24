const React = require('react')
const Layout = require('./Layout')

const AllTrips = ({ allTrips, username }) => {
    return (
        <Layout username={username}>
            <h2 className="all-trips-title">
                This is where you traveled:
            </h2>

            {allTrips.length ? allTrips.map((trip) => {
                return (
                <div className="account" key={trip._id}>
                    <h3>
                        <p id="list" className="list-od-trips list-item col-1-2">
                            <a className="trips-a big fancy-text light-link" href={`/trips/${trip.id}`}>
                                {trip.name}
                            </a>
                        </p>
                    </h3>
                </div>
                )
            }):
            <div className="account">
                <h3>
                    There's nothing here yet...
                </h3>
            </div>
            }  
        </Layout>
    )
}

module.exports = AllTrips