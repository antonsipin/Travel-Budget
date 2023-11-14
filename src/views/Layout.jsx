const React = require('react')

const Layout = ({ title, children, userName }) => {
    return (
        <html lang="en">
        <head>
            <title>{title}</title>
            <script defer src="/js/application.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js" />
            <link rel="stylesheet" href="/stylesheets/style.css" />
            <link rel="stylesheet" href="/stylesheets/stylesheet.css" />
            <link rel="stylesheet" href="/stylesheets/index.css" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css" />
            <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js" />
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
            <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" rel="stylesheet" />
        </head>
        <body>
            <header>
                <nav className="green lighten-3">
                    <div className=" nav-wrapper">
                        <a href="/" className="brand-logo" id="titlename">{title}</a>
                        <a href="#" className="sidenav-trigger" data-target="mobile-nav">
                        <i className="material-icons">menu</i>
                        </a>
                        {userName ?
                        <ul id="nav-mobile" className="right hide-on-med-and-down ul-index">
                            <li><a href="/">Home</a></li>
                            <li><a href="/account">{userName}</a></li>
                            <li><a href="/users/logout">Log Out</a></li>
                        </ul>:
                        <ul id="nav-mobile" className="right hide-on-med-and-down ul-index">
                            <li><a href="/">Home</a></li>
                            <li><a href="/users/login">Log in</a></li>
                            <li><a href="/users/signup">Sign up</a></li>
                        </ul>
                        }
                    </div>
                </nav>
                    {userName ?
                    <ul className="sidenav" id="mobile-nav">
                        <li><a href="/">Home</a></li>
                        <li><a href="/account">{userName}</a></li>
                        <li><a href="/users/logout">Log Out</a></li>
                    </ul>:
                    <ul className="sidenav" id="mobile-nav">
                        <li><a href="/">Home</a></li>
                        <li><a href="/users/login">Log in</a></li>
                        <li><a href="/users/signup">Sign up</a></li>
                    </ul>
                    }
            </header>

            { children }
        </body>
        </html>
    )
}

module.exports = Layout