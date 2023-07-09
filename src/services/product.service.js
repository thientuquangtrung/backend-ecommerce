const { product, cloth, electronic } = require("../models/product.model");
const { BadRequestError } = require("../core/error.response");

class ProductFactory {
    static productRegistry = {};

    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef;
    }

    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type];
        if (!productClass)
            throw new BadRequestError(`Invalid product type: ${type}`);

        return new productClass(payload).createProduct();
    }
}

class Product {
    constructor({name, thumb, price, quantity, type, shop, attributes}) {
        this.name = name;
        this.thumb = thumb;
        this.price = price;
        this.quantity = quantity;
        this.type = type;
        this.shop = shop;
        this.attributes = attributes;
    }

    async createProduct(productId) {
        return await product.create({ ...this, _id: productId });
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
        if (!newElectronic)
            throw new BadRequestError(`Create new electronic failed`);

        const newProduct = await super.createProduct(newElectronic._id);
        if (!newProduct) throw new BadRequestError(`Create new product failed`);

        return newProduct;
    }
}

// register product types
ProductFactory.registerProductType('Electronic', Electronic)

module.exports = ProductFactory;
