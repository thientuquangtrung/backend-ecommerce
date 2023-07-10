const { CREATED, OK } = require("../core/success.response");
const ProductService = require("../services/product.service");

class ProductController {
    createProduct = async (req, res, next) => {
        new OK({
            message: "Create product successfully!",
            metadata: await ProductService.createProduct(req.body.type, {
                ...req.body,
                shop: req.user.userId,
            }),
        }).send(res);
    };

    publishProductByShop = async (req, res, next) => {
        new OK({
            message: "Publish product successfully!",
            metadata: await ProductService.publishProductByShop({
                productId: req.params.id,
                shop: req.user.userId,
            }),
        }).send(res);
    };

    unPublishProductByShop = async (req, res, next) => {
        new OK({
            message: "Unpublish product successfully!",
            metadata: await ProductService.unPublishProductByShop({
                productId: req.params.id,
                shop: req.user.userId,
            }),
        }).send(res);
    };

    getAllDraftsForShop = async (req, res, next) => {
        new OK({
            message: "Get draft list successfully!",
            metadata: await ProductService.findAllDraftsForShop({
                shop: req.user.userId,
            }),
        }).send(res);
    };

    getAllPublishForShop = async (req, res, next) => {
        new OK({
            message: "Get publish list successfully!",
            metadata: await ProductService.findAllPublishForShop({
                shop: req.user.userId,
            }),
        }).send(res);
    };

    getListSearchProduct = async (req, res, next) => {
        new OK({
            message: "Get search list successfully!",
            metadata: await ProductService.searchProducts(req.params),
        }).send(res);
    };

    findAllProducts = async (req, res, next) => {
        new OK({
            message: "Get list successfully!",
            metadata: await ProductService.findAllProducts(req.query),
        }).send(res);
    };

    findProduct = async (req, res, next) => {
        new OK({
            message: "Get list successfully!",
            metadata: await ProductService.findProduct({
                productId: req.params.productId,
            }),
        }).send(res);
    };

    updateProduct = async (req, res, next) => {
        new OK({
            message: "Get list successfully!",
            metadata: await ProductService.updateProduct(
                req.body.type,
                req.params.productId,
                req.body
            ),
        }).send(res);
    };
}

module.exports = new ProductController();
