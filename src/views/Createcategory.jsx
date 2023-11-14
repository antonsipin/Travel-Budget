const React = require('react')
const Layout = require('./Layout')

const Createcategory = ({ userName, newTrip, error }) => {
    return (
        <Layout userName={userName}>
            <div className="container">
                <div className="row">
                    <div className="col-s-12">
                        <div className="d-flex justify-content-center">
                            <form 
                            className="d-flex flex-column align-items-center" 
                            method="POST" 
                            action="/newtrip/category"
                            id="createCategoryForm">
                                <p 
                                id="newtripTitle" 
                                className="useraccount giveitaname">
                                    Start {newTrip.name} trip calculation here:
                                </p>

                            {error &&
                            <p className="text-danger">{error}</p>
                            }

                            <div className="form-group">
                                <input 
                                    type="text" 
                                    placeholder="Name your trip category" 
                                    name="newCategoryName" 
                                    className="form-control"
                                    id="categoryName" 
                                />
                            </div> 
                            <br />

                            <div className="form-group">
                                <input 
                                    type="number" 
                                    placeholder="Enter your full budget" 
                                    name="fullCost" 
                                    className="form-control"
                                    id="newCategoryCost" 
                                />
                            </div> 
                            <br />

                            {newTrip.users.length && newTrip.users.map((user, index) => {
                                return (
                                    <div className="form-group" key={index}>
                                        <input 
                                            type="text" 
                                            value={user}
                                            placeholder="Enter people name's in your trip" 
                                            name="payers"
                                            className="form-control" 
                                            id="payers" 
                                        />
                                    </div>
                                )
                            })}
                            <br />

                            <div className="form-group">
                                <input 
                                    type="hidden" 
                                    name="tripName" 
                                    value={newTrip.name}
                                    className="form-control" 
                                    id="payers" 
                                />
                            </div>

                            <div className="form-group">
                                <input 
                                    type="hidden" 
                                    name="tripId" 
                                    value={newTrip.id}
                                    className="form-control" 
                                    id="tripId"
                                />
                            </div>

                            <div className="form-group">
                                <a className="useraccount giveitaname">
                                    Choose how would you like to split:
                                </a>
                            </div> 
                            <br />

                            <button 
                                id="equallyBtn" 
                                type="submit" 
                                className="btn btn-primary green lighten-3">
                                    Split Even
                            </button>

                            <button 
                                formAction="/newtrip/category/castomize" 
                                formMethod="post" 
                                type="submit" 
                                value={newTrip.name}
                                name="tripName" className="btn btn-primary green lighten-3">
                                    Custom split 
                            </button>

                            </form> 
                            <br />
                        </div>
                    </div>
                </div>
            </div>

        </Layout>
    )
}

module.exports = Createcategory