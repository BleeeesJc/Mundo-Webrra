// routes/mapRoutes.js
const express = require('express');
const router = express.Router();
const mapController = require('../controllers/mapController');

router.post('/', mapController.createMap);
router.get('/', mapController.getMaps);
router.get('/:id', mapController.getMapById);
router.put('/:id', mapController.updateMap);
router.delete('/:id', mapController.deleteMap);

module.exports = router;
