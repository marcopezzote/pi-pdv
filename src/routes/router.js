const express = require("express");
const authenticateUser = require("../middleware/auth");
const { getList } = require("../controller/categories/get_list");
const register = require("../controller/users/post_register");
const loginUser = require("../controller/users/get_login");
const getUser = require("../controller/users/get_user");
const updateUser = require("../controller/users/put_updateUser");
const { createProduct } = require("../controller/products/post_product");
const { updateProduct } = require("../controller/products/put_product");
const { getProducts } = require("../controller/products/get_product");
const { getProductById } = require("../controller/products/get_detailProduct");
const {
  deleteProduct,
} = require("../controller/products/delete_deleteProduct");
const { registerClient } = require("../controller/clients/post_registerClient");
const { detailsClient } = require("../controller/clients/get_detailsClient");
const { updateClient } = require("../controller/clients/put_updateClient");
const { getClients } = require("../controller/clients/get_clients");
const { uploadFile } = require("../utils/storage");
const {
  checkProductOrder,
  deleteProductImage,
} = require("../middleware/productMiddlewares");

const multer = require("multer");
const registerOrder = require("../controller/orders/post_order");
const orderList = require("../controller/orders/get_orderList");
const upload = multer();

const router = express();

router.post("/usuario", register);
router.post("/login", loginUser);

router.use(authenticateUser);

router.post("/cliente", registerClient);
router.post("/pedido", registerOrder);
router.post("/produto", uploadFile, createProduct);

router.get("/usuario", getUser);
router.get("/categoria", getList);
router.get("/cliente", getClients);
router.get("/cliente/:id", detailsClient);
router.get("/produto/:id", getProductById);
router.get("/produto", getProducts);
router.get("/pedido", orderList);

router.put("/usuario", updateUser);
router.put("/cliente/:id", updateClient);
router.put("/produto/:id", uploadFile, updateProduct);

router.delete(
  "/produto/:id",
  checkProductOrder,
  deleteProductImage,
  deleteProduct
);

module.exports = { router };
