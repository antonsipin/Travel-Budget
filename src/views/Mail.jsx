'use client'
const React = require('react')
const Loader = require('./Loader')

const Mail = ({ trip }) => {
    const [email, setEmail] = React.useState('')
    const [loaderStatus, setLoaderStatus] = React.useState(false)
    const [error, setError] = React.useState('')

    const handleClick = () => {
        if (email) {
            setLoaderStatus(true)
            setError('')
        } else {
            setError('Email is required')
        }
    }

    return (
            <div className="container">
                <div className="account">
                    <div className="col s12">
                        <br />
                        <h3 className="useraccount">
                            Here you can send the report by email:
                        </h3>
                    </div>
                </div>
                <br />

                {loaderStatus ? 
                <Loader />:
                <form 
                    name="mailForm" 
                    method="POST" 
                    action="/mail" 
                    id="mailForm">

                    <input
                        required
                        type="email"
                        name="email"
                        onChange={(e) => setEmail(e.target.value)} 
                        value={email.length ? email : ''} 
                        className="input-in-form" 
                        id="email-p"
                    />
                    {error && 
                    <label style={{
                        color: "red", 
                        fontSize: "1.3rem", 
                        fontWeight: "600",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                        }}>
                        {error}
                    </label>
                    }  

                    <input 
                        type="hidden"
                        name="tripName"
                        value={trip.name} 
                        className="form-control" 
                        id="tripName"
                    />

                    <input 
                        type="hidden"
                        name="id"
                        value={trip._id} 
                        className="form-control" 
                        id="id"
                    />

                    <input 
                        type="hidden"
                        name="users"
                        value={trip.users} 
                        className="form-control" 
                        id="users"
                    />

                    <button 
                        onClick={handleClick}
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
                            Send this report by email
                    </button>
                    <br />
                </form>    
                }    
            </div>
    )
}

module.exports = Mail