function rootMiddleware(req, res, next) {
    const currentTime = new Date().toUTCString();
    let isAuthenticated;
    if (req.session.user) {
        isAuthenticated = "Authenticated User";
    }
    else {
        isAuthenticated = "Non-Authenticated User";
    }

    //console for every request made to server
    console.log(`[${currentTime}]: ${req.method} ${req.originalUrl} (${isAuthenticated})`);

    // Should redirect logged in user if they are accessing login page
    if (req.session.user) {
        if (req.path.startsWith('/login') || req.path.startsWith('/register')) {
            return res.redirect('/');
        }
    }

    // Should allow unauthed user to register
    if (!req.session.user && req.path === '/register') {
        return next();
    }

    // Should redirect unauthed user to login if they are not on login
    if (!req.session.user && req.path !== '/login') {
        return res.redirect('/login');
    }

    return next();
}

function authenticatedMiddleware(req, res, next) {
    //if not login, user is not authentic user to review and comment
    if(!req.session.user) {
        return res.redirect('/login');
    }
    next();
}

function logoutMiddleware(req, res, next) {
    // Only action on the logout route
    if(req.path.startsWith('/logout')) {
        if (req.session.user) {
            return next();
        }
        else {
            return res.redirect('/login');
        }
    }

}

export { rootMiddleware, authenticatedMiddleware, logoutMiddleware };