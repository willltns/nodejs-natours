const express = require('express');

const ctrl = require('../controllers/userCtrl');

const router = express.Router();

router
  .route('/')
  .get(ctrl.getUsers)
  .post(ctrl.createUser);

router
  .route('/:id')
  .get(ctrl.getUser)
  .patch(ctrl.updateUser)
  .delete(ctrl.deleteUser);

module.exports = router;
