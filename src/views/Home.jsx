const React = require('react')
const Layout = require('./Layout')

const Home = ({ title, username }) => {
    return (
        <Layout title={title} username={username}>
            <div className="equally">
                <a href="/" className="brand-logo" id="image-index">
                    <img src="money.jpg" width="200" />
                </a>
                <h2 className="main-title">
                    Less stress when 
                    <br /> 
                        sharing expenses 
                    <br />
                    <span id="gr-word">
                        with anyone.
                    </span>
                </h2>
                <h4 className="main-sub">
                    Split expenses with any group: 
                    <br/> trips, housemates, friends, and family.
                </h4>
            </div>

            {!username && 
            <div className="signUp">
                <a href="/users/signup" className="btn-pos orange waves-effect waves-light btn-large">Sign up</a>
            </div>
            }

            <footer>
                <p className="footer-text"></p>
            </footer>
        </Layout>
    )
}

module.exports = Home