const isAuthenticated = (req, res, next) => {
  if (req.session) {
    next();
  } else {
    res.status(400).json({
      isLoggedOut: false, 
      message: 'Please login.'
    })
  }
};

export default isAuthenticated;
