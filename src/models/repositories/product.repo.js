const { Types } = require("mongoose");
const { getSelectData, getUnSelectData, parseObjectIdMongodb } = require("../../utils");
const { product } = require("../product.model");

const findAllDraftsForShop = async ({ query, limit, skip }) => {
    return await product
        .find(query)
        .populate("shop", "name email -_id")
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
};

const findAllPublishForShop = async ({ query, limit, skip }) => {
    return await product
        .find(query)
        .populate("shop", "name email -_id")
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
};

const searchProductByUser = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch);
    const result = await product
        .find(
            {   
                isPublished: true,
                $text: {
                    $search: regexSearch,
                },
            },
            {
                score: { $meta: "textScore" },
            }
        )
        .sort({ score: { $meta: "textScore" } })
        .lean();

    return result
};

const findAllProducts = async ({
    sort = "ctime",
    limit = 60,
    page = 1,
    filter = { isPublished: true },
    select
}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? {_id : -1} : {_id: 1};
    const products = await product.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()

    return products
}

const findProduct = async ({
    productId,
    unSelect
}) => {
    const oneProduct = await product.findById(productId)
        .select(getUnSelectData(unSelect))
        .lean()

    return oneProduct
}

const publishProductByShop = async ({ shop, productId }) => {
    const foundShop = await product.findOne({
        shop: new Types.ObjectId(shop),
        _id: new Types.ObjectId(productId),
    });
    if (!foundShop) return null;

    foundShop.isDraft = false;
    foundShop.isPublished = true;
    const { modifiedCount } = await foundShop.updateOne(foundShop);

    return modifiedCount;
};

const unPublishProductByShop = async ({ shop, productId }) => {
    const foundShop = await product.findOne({
        shop: new Types.ObjectId(shop),
        _id: new Types.ObjectId(productId),
    });
    if (!foundShop) return null;

    foundShop.isDraft = true;
    foundShop.isPublished = false;
    const { modifiedCount } = await foundShop.updateOne(foundShop);

    return modifiedCount;
};

const updateProductById = async({
    productId,
    payload,
    model,
    isNew = true
}) => {
    return await model.findByIdAndUpdate(productId, payload, {
        new: isNew,
    })
}

const getProductById = async (productId) => {
    return await product.findOne({_id: parseObjectIdMongodb(productId)}).lean()
}

module.exports = {
    findAllDraftsForShop,
    publishProductByShop,
    findAllPublishForShop,
    unPublishProductByShop,
    searchProductByUser,
    findAllProducts,
    findProduct,
    updateProductById,
    getProductById
};
