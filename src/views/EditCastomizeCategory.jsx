const React = require('react')
const Layout = require('./Layout')

const EditCastomizeCategory = ({ userName, newTrip, categoryName, fullCost, error, payers, category }) => {
    return (
        <Layout userName={userName}>
            <div className="container">
                <div className="equally">
                    <h2 
                        id="gr-word">
                            {newTrip.name} trip
                    </h2>
                    <br />

                    <h2 
                    className="useraccount giveitaname">
                        Category: {categoryName}
                    <br />
                        Total Budget: {fullCost}
                    </h2>

                    <div className="d-flex justify-content-center">
                        <form 
                            className="d-flex flex-column align-items-center" 
                            method="POST"
                            action={`/newtrip/category/saveEditCastom/${category.id}`} id="castomizeCategoryForm">

                            <h4>
                                <p 
                                    id="newtripTitle" 
                                    className="giveitaname useraccount">
                                        Please enter amount for each payer:
                                </p>
                            </h4>

                            {error &&
                                <p className="text-danger">
                                    {error}
                                </p>
                            }

                            {payers.length && payers.map((payer, index) => {
                                return (
                                    <div className="form-group" key={index}>
                                        <input 
                                            type="text" 
                                            placeholder={`Enter cost for ${payer}`} name="castomizeCategoryCost" 
                                            className="form-control"
                                            id="castomizeCategory" 
                                        />
                                        <input 
                                            type="hidden" 
                                            name="payer" 
                                            value={payer}
                                        />
                                    </div>
                                )
                            })}
                            <br />

                            <input 
                                type="hidden" 
                                name="categoryName" 
                                value={categoryName}
                            />

                            <input 
                                type="hidden" 
                                name="fullCost" 
                                value={fullCost}
                            />

                            <input 
                                type="hidden" 
                                name="tripName" 
                                value={newTrip.name}
                            />

                            <input 
                                type="hidden" 
                                name="categoryId" 
                                value={category.id}
                            />

                            <button 
                                id="castomizeCategoryBtn"
                                type="submit" 
                                className="btn btn-primary">
                                    Save category
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    )
    
}

module.exports = EditCastomizeCategory