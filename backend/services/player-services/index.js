// routes/mapRoutes.js
const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');

router.post('/', playerController.createMap);
router.get('/', playerController.getMaps);
router.get('/:id', playerController.getMapById);
router.put('/:id', playerController.updateMap);
router.delete('/:id', playerController.deleteMap);

module.exports = router;
