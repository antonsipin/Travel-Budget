const React = require('react')

const Layout = ({ title = 'Travel Budget', children, username }) => {
    return (
            <html lang="en">
                <head>
                    <title>{title}</title>
                    <script defer src="/js/application.js"></script>
                    <script defer src="/js/signIn.js"></script>
                    <script defer src="/js/signUp.js"></script>
                    <script src="/js/jquery.js" />
                    <script src="/js/materialize.js" />
                    <link rel="stylesheet" href="/stylesheets/style.css" />
                    <link rel="stylesheet" href="/stylesheets/stylesheet.css" />
                    <link rel="stylesheet" href="/stylesheets/index.css" />
                    <link rel="stylesheet" href="/stylesheets/materialize.css" />
                    <link rel="stylesheet" href="/stylesheets/fonts.css" />
                    <link rel="stylesheet" href="/stylesheets/styles.css" />
                </head>
                <body>
                    <header>
                        <nav className="green lighten-3">
                            <div className=" nav-wrapper">
                                <a href="/" className="brand-logo" id="titlename">{title}</a>
                                <a href="#" className="sidenav-trigger" data-target="mobile-nav">
                                <i className="material-icons">menu</i>
                                </a>
                                {username ?
                                <ul id="nav-mobile" className="right hide-on-med-and-down ul-index">
                                    <li><a href="/">Home</a></li>
                                    <li><a href="/accounts">{username}</a></li>
                                    <li><a href="/users/logout">Log Out</a></li>
                                </ul>:
                                <ul id="nav-mobile" className="right hide-on-med-and-down ul-index">
                                    <li><a href="/">Home</a></li>
                                    <li><a href="/auth/login">Log in</a></li>
                                    <li><a href="/auth/signup">Sign up</a></li>
                                </ul>
                                }
                            </div>
                        </nav>
                            {username ?
                            <ul className="sidenav" id="mobile-nav">
                                <li><a href="/">Home</a></li>
                                <li><a href="/accounts">{username}</a></li>
                                <li><a href="/users/logout">Log Out</a></li>
                            </ul>:
                            <ul className="sidenav" id="mobile-nav">
                                <li><a href="/">Home</a></li>
                                <li><a href="/auth/login">Log in</a></li>
                                <li><a href="/auth/signup">Sign up</a></li>
                            </ul>
                            }
                    </header>

                    { children }
                </body>
            </html>
    )
}

module.exports = Layout