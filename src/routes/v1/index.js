const express = require('express');
const config = require('../../config/config');
const userRoute = require('./user.route');
const cabRoute = require('./cab.route');
const router = express.Router();

const defaultRoutes = [
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/cabs',
    route: cabRoute,
  },
];

const devRoutes = [
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
};

module.exports = router;
