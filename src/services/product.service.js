const { product, cloth, electronic } = require("../models/product.model");
const { BadRequestError } = require("../core/error.response");
const {
    findAllDraftsForShop,
    publishProductByShop,
    findAllPublishForShop,
    unPublishProductByShop,
    searchProductByUser,
    findAllProducts,
    findProduct,
    updateProductById,
} = require("../models/repositories/product.repo");
const { removeUnexpectedObject, updateNestedObject } = require("../utils");
const { insertInventory } = require("../models/repositories/inventory.repo");
const { pushNotificationToSystem } = require("./notification.service");

//#region Factory Methods
class ProductFactory {
    static productRegistry = {};

    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef;
    }

    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type];
        if (!productClass) throw new BadRequestError(`Invalid product type: ${type}`);

        return new productClass(payload).createProduct();
    }

    static async updateProduct(type, productId, payload) {
        const productClass = ProductFactory.productRegistry[type];
        if (!productClass) throw new BadRequestError(`Invalid product type: ${type}`);

        return new productClass(payload).updateProduct(productId);
    }

    // PUT //
    static async publishProductByShop({ productId, shop }) {
        return await publishProductByShop({ shop, productId });
    }

    static async unPublishProductByShop({ productId, shop }) {
        return await unPublishProductByShop({ shop, productId });
    }
    // END PUT //

    // query //
    static async findAllDraftsForShop({ shop, limit = 60, skip = 0 }) {
        const query = { shop, isDraft: true };
        return await findAllDraftsForShop({ query, limit, skip });
    }

    static async findAllPublishForShop({ shop, limit = 60, skip = 0 }) {
        const query = { shop, isPublished: true };
        return await findAllPublishForShop({ query, limit, skip });
    }

    static async findAllProducts({ sort = "ctime", limit = 60, page = 1, filter = { isPublished: true } }) {
        return await findAllProducts({
            limit,
            sort,
            page,
            filter,
            select: ["name", "price", "thumb", "shop"],
        });
    }

    static async findProduct({ productId }) {
        return await findProduct({
            productId,
            unSelect: ["__v"],
        });
    }

    static async searchProducts({ keySearch }) {
        return await searchProductByUser({ keySearch });
    }
}
//#endregion Factory methods

class Product {
    constructor({ name, thumb, price, quantity, type, shop, attributes }) {
        this.name = name;
        this.thumb = thumb;
        this.price = price;
        this.quantity = quantity;
        this.type = type;
        this.shop = shop;
        this.attributes = attributes;
    }

    async createProduct(productId) {
        const newProduct = await product.create({ ...this, _id: productId });
        if (newProduct) {
            // add inventory
            await insertInventory({
                productId: newProduct._id,
                shopId: this.shop,
                stock: this.quantity,
            });

            // push notification to System
            pushNotificationToSystem({
                type: "SHOP_001",
                receiverId: 1,
                senderId: this.shop,
                options: {
                    product_name: this.name,
                    shop_name: this.shop,
                },
            })
                .then(console.log)
                .catch(console.error);
        }

        return newProduct;
    }

    async updateProduct(productId, payload) {
        return await updateProductById({ productId, payload, model: product });
    }
}

class Cloth extends Product {
    async createProduct() {
        const newCloth = await cloth.create({
            ...this.attributes,
            shop: this.shop,
        });
        if (!newCloth) throw new BadRequestError(`Create new cloth failed`);

        const newProduct = await super.createProduct();
        if (!newProduct) throw new BadRequestError(`Create new product failed`);

        return newProduct;
    }
}

class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.attributes,
            shop: this.shop,
        });
        if (!newElectronic) throw new BadRequestError(`Create new electronic failed`);

        const newProduct = await super.createProduct(newElectronic._id);
        if (!newProduct) throw new BadRequestError(`Create new product failed`);

        return newProduct;
    }

    async updateProduct(productId) {
        const objectParams = removeUnexpectedObject(this);

        if (objectParams.attributes) {
            // update child
            await updateProductById({
                productId,
                payload: updateNestedObject(objectParams.attributes),
                model: product,
            });
        }

        const updateProduct = await super.updateProduct(productId, updateNestedObject(objectParams));

        return updateProduct;
    }
}

// register product types
ProductFactory.registerProductType("Electronic", Electronic);

module.exports = ProductFactory;
