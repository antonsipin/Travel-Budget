const React = require('react')
const Layout = require('./Layout')

const SavedCastomizeCategory = ({ username, castomCostArr, newTrip, categoryName }) => {
    return (
        <Layout username={username}>
            <div className="container">
                <div className="equally">
                    <h2 
                    id="gr-word">
                        {newTrip.name} trip
                    </h2>
                    <br />

                    <h2 
                    className="useraccount giveitaname">
                        Category {categoryName} successfully saved!
                    </h2>

                    <div className="d-flex justify-content-center">
                        <form className="account">
                            <button 
                                formAction="/newtrip/addcategory" 
                                name="tripName" 
                                formMethod="post" 
                                type="submit"
                                value={newTrip.name} 
                                className="btn btn-primary green lighten-3">
                                    Add category
                            </button>
                        </form>
                    </div> 
                    <br />

                    {castomCostArr.length && castomCostArr.map((category) => {
                        return (
                            <div className="account" key={category._id}>
                                <h3>
                                    <a> {category.name}, </a>
                                    <a> you spent {category.cost}.00 USD </a> 
                                    <br />
                                </h3>
                            </div>
                        )
                    })}
                </div>
            </div>
        </Layout>
    )
}

module.exports = SavedCastomizeCategory