const express = require('express');

const userCtrl = require('../controllers/userCtrl');
const authCtrl = require('../controllers/authCtrl');

const router = express.Router();

router.post('/signup', authCtrl.signup);

router.post('/login', authCtrl.login);

router.patch('/updateMyPassword', authCtrl.protect, authCtrl.updateMyPassword);
router.patch('/updateMe', authCtrl.protect, userCtrl.updateMe);
router.delete('/deleteMe', authCtrl.protect, userCtrl.deleteMe);

router
  .route('/')
  .get(userCtrl.getUsers)
  .post(userCtrl.createUser);

router
  .route('/:id')
  .get(userCtrl.getUser)
  .patch(userCtrl.updateUser)
  .delete(userCtrl.deleteUser);

module.exports = router;
