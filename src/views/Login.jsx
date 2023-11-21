const React = require('react')
const Layout = require('./Layout')

const Login = ({ error }) => {
    return (
        <Layout>
            <div className="form-div">
                {error &&
                    <div className="errors-wrapper">
                        <span id="gr-word">{error}</span>
                        <ul className="errors">
                        </ul>
                    </div>
                }
            </div>

            <div className="form-div">
                <span className="signin-error" />
                <form className="form-form" method="post" action="/users/login" name="login">
                    <label htmlFor="email">Email:</label>
                    <input className="input-in-form" id="email" name="email" type="email" />
                    <label className="required-error"></label>

                    <label htmlFor="password" className="block mar-b-1">Password:</label>

                    <input className="input-in-form" id="password" name="password" type="password" />
                    <label className="required-error"></label>

                    <input className="btn-pos orange btn waves-effect waves-light" type="submit" value="Log In" />
                </form>
            </div>
        </Layout>
    )
}

module.exports = Login