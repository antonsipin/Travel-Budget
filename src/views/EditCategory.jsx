const React = require('react')
const Layout = require('./Layout')

const EditCategory = ({ userName, categoryName, category, error, newTrip }) => {
    return (
        <Layout userName={userName}>
            <div className="container">
                <div className="row">
                    <div className="col-s-12">
                        <div className="d-flex justify-content-center">
                            <form 
                                className="d-flex flex-column align-items-center" 
                                method="POST"
                                action={`/newtrip/category/edit/${category.id}`}
                                id="createCategoryForm">
                                <p 
                                    id="newtripTitle" 
                                    className="useraccount giveitaname">
                                        Edit category "{categoryName}" here:
                                </p>

                                {error && 
                                <p className="text-danger">
                                    {error}
                                </p>
                                }

                                <div className="form-group">
                                    <input 
                                        type="text" 
                                        placeholder="Name your trip category" 
                                        name={'name'} 
                                        className="form-control"
                                        id="categoryName" 
                                        value={category.name} 
                                    />
                                </div> 
                                <br />

                                <div className="form-group">
                                    <input 
                                        type="number" 
                                        placeholder="Enter your full budget" 
                                        name={'cost'} 
                                        className="form-control"
                                        id="newCategoryCost" 
                                        value={category.cost} 
                                    />
                                </div> 
                                <br />

                                <div className="form-group">
                                    {category.users.length && category.users.map((user, index) => {
                                        return (
                                            <input 
                                                key={index}
                                                type="text" 
                                                placeholder="Enter people name's in your trip" 
                                                name={'users'}
                                                className="form-control" 
                                                id="payers" 
                                                value={user.name}
                                            />
                                        )
                                    })}
                                </div> 
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
                                    formAction={`/newtrip/category/edit/castomize/${category.id}`} formMethod="post" 
                                    type="submit"
                                    value={newTrip.name} 
                                    name="tripName" 
                                    className="btn btn-primary green lighten-3">
                                        Custom split
                                </button>

                                <div className="form-group">
                                    <input 
                                        type="hidden" 
                                        name="categoryName" 
                                        value={category.name} 
                                        className="form-control" 
                                    />
                                </div>

                                <div className="form-group">
                                    <input 
                                        type="hidden" 
                                        name="fullCost" 
                                        value={category.cost} 
                                        className="form-control" 
                                    />
                                </div>

                                <div className="form-group">
                                    <input 
                                        type="hidden" 
                                        name="categoryId" 
                                        value={category.id} 
                                        className="form-control" 
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

module.exports = EditCategory