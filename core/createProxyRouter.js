const express = require("express");

function createProxyRouter() {
  let currentRouter = express.Router();

  const proxy = (req, res, next) => {
    currentRouter(req, res, next);
  };

  proxy.setRouter = (newRouter) => {
    currentRouter = newRouter;
  };

  return proxy;
}

module.exports = createProxyRouter;
