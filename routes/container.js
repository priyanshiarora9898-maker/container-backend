const express = require('express');
const router = express.Router();

const { fetchContainerController, createContainerController, updateContainerController } = require('../controllers/container');

router.post('/create', createContainerController);
router.post('/update', updateContainerController);
router.get('/fetch', fetchContainerController);

module.exports = router;