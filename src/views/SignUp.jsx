const React = require('react')
const Layout = require('./Layout')

const SignUp = ({ error }) => {
    return (
        <Layout>
            <div className="form-div">
                {error &&
                <div className="errors-wrapper">
                    <span id="gr-word">{error}</span>
                    <ul className="errors"></ul>
                </div>
                }
            </div>

            <div className="form-div">
                <span className="signup-error" />
                <form className="form-form" method="post" action="/users/signup" name="signup">
                    <label htmlFor="username">Your Name:</label>
                    <input className="input-in-form" id="name-p" name="name" type="text" />
                    <label className="required-error"></label>

                    <label htmlFor="useremail">Email:</label>
                    <input className="input-in-form" id="email-p" name="email" type="email" />
                    <label className="required-error"></label>

                    <label htmlFor="userpassword">Password:</label>
                    <input className="input-in-form" id="password-p" name="password" type="password" />
                    <label className="required-error"></label>

                    <input className="btn-pos orange btn waves-effect waves-light" id="registration" type="submit" value="sign up" />
                </form>
            </div>
        </Layout>
    )
}

module.exports = SignUp