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
        if (req.session.user.role === 'admin' && !req.path.startsWith('/admin')) {
            return res.redirect('/admin');
        }

        if (req.session.user.role === 'user' && !req.path.startsWith('/protected')) {
            return res.redirect('/protected');
        }

        // TODO: invalid user role, destroy the session and redirect to login, maybe redirect to logout page if logout can do it
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


function registerMiddleware(req, res, next) {
    // Only action on the /register route
    if (req.path ==='/register') {
        // Redirect logged in users
        if (req.session.user) {
            if (req.session.user.role === 'admin') {
                return res.redirect('/admin');
            }

            if (req.session.user.role === 'user') {
                return res.redirect('/protected');
            }

            // TODO: invalid user role, destroy the session and redirect to login, maybe redirect to logout page if logout can do it
        }
    }

    return next();
}
 
function protectedMiddleware(req, res, next) {
    /*
    const currentTime = new Date().toUTCString();
    let isAuthenticated;
    if (req.session.user) {
        isAuthenticated = "Authenticated User";
    }
    else {
        isAuthenticated = "Non-Authenticated User";
    }

    console.log(`[${currentTime}]: ${req.method} ${req.originalUrl} (${isAuthenticated})`);

    */
    if (req.path.startsWith('/protected')) {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        // Redirect admin back to admin route
        if (req.session.user.role === 'admin') {
            return res.redirect('/admin');
        }

        if (req.session.user.role !== 'user') {
            // TODO: invalid user role, destroy the session and redirect to login, maybe redirect to logout page if logout can do it
        }
    }

    return next();
}

function adminMiddleware(req, res, next) {
    
    // Only action of the admin routes
    if (req.path.startsWith('/admin')) {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        // Redirect user back to user route
        if (req.session.user.role === 'user') {
            return res.redirect('/user');
        }

    }

    return next();
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

export { rootMiddleware, registerMiddleware, protectedMiddleware, adminMiddleware, logoutMiddleware };