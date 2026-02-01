const express = require('express');
const router = express.Router();
const { verifyPincode, addPincode, bulkAddPincodes, getPincodes, deletePincode } = require('../controllers/pincodeController');
const { auth, adminOnly } = require("../middlewares/authMiddleware")

router.post('/verify', verifyPincode);
router.post('/bulk', auth, adminOnly, bulkAddPincodes);
router.route('/').get(auth, adminOnly, getPincodes).post(auth, adminOnly, addPincode);
router.route('/:id').delete(auth, adminOnly, deletePincode);

module.exports = router;
