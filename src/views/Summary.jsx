'use client'
const React = require('react')
const Layout = require('./Layout')
const Mail = require('./Mail')

const Summary = ({ userName, trip, allCategories, resultNames, resulCostArr, maxSumObj, chartSourceLink }) => {
    return (
        <Layout userName={userName}>
            <div className="container">
                <div className="account">
                    <h2>
                        <div className="row">
                            <div className="card-panel green lighten-3">
                                Here is your {trip.name} trip summary
                            </div>
                        </div>
                    </h2>
                </div>

                    <div className="account">
                        <div className="col s12">
                            <h3 className="useraccount">
                                Here's what you did on this journey:
                            </h3>
                        </div>
                    </div>

                    {allCategories.length && allCategories.map((category) => {
                        return (
                            <div className="account" key={category._id}>
                                <div className="col s12">
                                    <h4>
                                        <a className="big fancy-text light-link">
                                            {category.name}
                                        </a> 
                                        <br />
                                    </h4>
                                </div>
                            </div>
                        )
                    })}

                    <div className="account">
                        <div className="col s12">
                            <br />
                                <h3 className="useraccount">
                                    Your friends on this journey were:
                                </h3> 
                            <br />
                        </div>
                    </div>

                    {resultNames.length && resultNames.map((name, index) => {
                        return (
                            <div className="account" key={index}>
                                <div className="col s12">
                                    <h4>
                                        <a className="big fancy-text light-link">   
                                            {name}
                                        </a> 
                                        <br />
                                    </h4>
                                </div>
                            </div>
                        )
                    })}

                    <div className="account">
                        <div className="col s12">
                            <br />
                                <h3 className="useraccount">
                                    This is how much money you and your friends spent during the whole trip:
                                </h3> 
                            <br />
                        </div>
                    </div>

                    {resulCostArr.length && resulCostArr.map((category) => {
                        return (
                            <div className="account" key={category.id}>
                                <div className="col s12">
                                    <h4>
                                        <div className="row">
                                            <a>
                                                {category.name} spent {category.cost}.00 USD
                                            </a>
                                            <progress value={category.cost} max={`../${maxSumObj.cost}`} />
                                        </div>
                                    </h4>
                                </div>
                            </div>
                        )
                    })}
                    <br />

                    <div className="account">
                        <img width="595" src={chartSourceLink} /> 
                    </div>
                    <br />

                    <Mail trip={trip} />
                <br />
            </div>
        </Layout>
    )
}

module.exports = Summary