const React = require('react')
const Layout = require('./Layout')

const Equally = ({ userName, newTrip, categoryName, newCategory, payerCost, tripName, payers }) => {
    return (
        <Layout userName={userName}>
            <div className="container">
                <div className="equally">
                    <h2 id="gr-word">
                        {newTrip.name} trip
                    </h2>

                    <h2 className="giveitaname useraccount">
                        Category {categoryName} successfully saved!
                    </h2>

                    <form 
                        method="POST" 
                        action={`/newtrip/category/${newCategory.id}`}
                        id="editCategoryForm">

                    <button 
                        formAction="/newtrip/addcategory" 
                        name="tripId" 
                        formMethod="post" 
                        type="submit" 
                        value={newTrip.id}
                        className="btn btn-primary green lighten-3">
                            Add category
                    </button>

                    <button 
                        id="equallyBtn" 
                        type="submit" 
                        className="btn btn-primary green lighten-3">
                            Edit this category
                    </button>

                    <input 
                        type="hidden" 
                        name="categoryName" 
                        value={categoryName} 
                        className="form-control" 
                        id="categoryName"
                    />

                    <input 
                        type="hidden" 
                        name="tripName" 
                        value={newTrip.name}
                        className="form-control" 
                        id="tripName"
                    />

                    <input 
                        type="hidden" 
                        name="tripId" 
                        value={newTrip.id}
                        className="form-control" 
                        id="tripId"
                    />

                    </form>

                    {payers.length && payers.map((payer, index) => {
                        return (
                            <h3 className="giveitaname useraccount title" key={index}>
                                <span 
                                    className="entry-date block font-3-4 c-lt-gray"> 
                                        Name: {payer} 
                                </span>
                            </h3>
                        )
                    })}

                    <a className="totalspent giveitaname useraccount"> 
                    <br />
                        Each Owns $ {payerCost}.00
                    </a>

                    <div className="form-group">
                        <input 
                            type="hidden" 
                            name="tripName" 
                            value={tripName}
                            className="form-control" 
                            id="payers" 
                        />
                    </div>
                </div>
            </div>
        </Layout>
    )
 }

 module.exports = Equally