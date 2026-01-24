const express = require('express');
const { body } = require('express-validator');
const {
  listProducts,
  getProduct,
  getProductBasic,
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
  listCategories,
  addReview,
  updateCategory,
  deleteCategory,
  getProductManuals,
  getAllManuals
} = require('../controllers/productController');
const { getManual } = require('../controllers/adminController');
const { auth, adminOnly } = require('../middlewares/authMiddleware');
const upload = require('../config/upload');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

router.get('/', listProducts);
router.get('/categories', listCategories);
router.get('/:id', getProduct);
router.get('/:id/basic', getProductBasic);
router.post(
  '/:id/reviews',
  auth,
  [body('rating').isInt({ min: 1, max: 5 })],
  validateRequest,
  addReview
);

// Public manual access
router.get('/manuals/all', getAllManuals);
router.get('/:productId/manual', getProductManuals);

router.post(
  '/',
  auth,
  adminOnly,
  upload.array('images', 5),
  [body('name').notEmpty(), body('price').isNumeric()],
  validateRequest,
  createProduct
);
router.put('/:id',
  auth,
  adminOnly,
  upload.array('images', 5),
  validateRequest,
  updateProduct
);
router.delete('/:id', auth, adminOnly, deleteProduct);

router.post('/categories', auth, adminOnly, [body('name').notEmpty()], validateRequest, createCategory);
router.put('/categories/:id', auth, adminOnly, validateRequest,updateCategory);
router.delete('/categories/:id', auth, adminOnly, deleteCategory);
module.exports = router;


