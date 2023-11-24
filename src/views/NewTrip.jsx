const React = require('react')
const Layout = require('./Layout')

const NewTrip = ({ username, error }) => {
    return (
        <Layout username={username}>
            <div className="container">
                <div className="row">
                    <div className="col-s-12">
                        <div className="d-flex justify-content-center">
                            <form 
                                className="d-flex flex-column align-items-center" 
                                method="POST" 
                                action="/trips" 
                                id="newtripForm"
                            >
                                <h3>
                                    <p id="newtripTitle" className="useraccount giveitaname">Name your trip, add friends!
                                    </p>
                                </h3>

                            {error &&
                            <p className="text-danger">
                                {error}
                            </p>
                            }

                            <div className="form-group">
                                <input 
                                    type="text" 
                                    placeholder="Enter new trip name" 
                                    name="newTripName" 
                                    className="form-control"
                                    id="newtripName" 
                                />
                            </div> 
                            <br />

                            <div className="form-group">
                                <input 
                                    type="text" 
                                    placeholder="Type your friends here" 
                                    name="tripUsers" 
                                    className="form-control" 
                                />
                            </div> 
                            <br />

                                <button 
                                    id="createNewtripBtn" 
                                    type="submit"
                                    className="btn btn-primary waves-effect waves-light btn-large nav-wrapper green lighten-3"
                                >
                                    Create new trip
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

module.exports = NewTrip