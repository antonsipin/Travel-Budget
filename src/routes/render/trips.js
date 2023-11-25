const express = require('express');
const router = express.Router();
const tripsController = require('../../controllers/render/trips-controller')

router
  .route('/')
  .get(tripsController.renderNewtrip)
  .post(tripsController.createNewTrip)

router
  .route('/category')
  .get(tripsController.renderCreateCategory)
  .post(tripsController.createNewCategory)

router
  .route('/category/new')
  .post(tripsController.addCategory)

router
  .route('/category/castom')
  .get(tripsController.renderCastomizeCategory)
  .post(tripsController.castomizeCategory)

router
  .route('/category/castom/save')
  .get(tripsController.renderSavedCastomizeCategory)
  .post(tripsController.saveCastomizeCategory)

router
  .route('/allTrips')
  .get(tripsController.allTrips)

router
  .route('/:id')
  .get(tripsController.findTripById)

router
  .route('/category/:id')
  .post(tripsController.findCategoryById)

router
  .route('/category/options/:id')
  .post(tripsController.editCategoryEqually)

router
  .route('/category/options/castom/:id')
  .post(tripsController.editCategoryCastomize)

router
  .route('/category/options/castom/next/:id')
  .post(tripsController.saveEditCastom)

module.exports = router
