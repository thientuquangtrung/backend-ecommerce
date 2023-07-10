const { getSelectData, getUnSelectData } = require("../../utils");
const discountModel = require("../discount.model");

const findAllDiscountCodeUnselect = async ({
    sort = "ctime",
    limit = 60,
    page = 1,
    filter,
    unSelect,
}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
    const discounts = await discountModel
        .find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getUnSelectData(unSelect))
        .lean();

    return discounts;
};

const findAllDiscountCodeSelect = async ({
    sort = "ctime",
    limit = 60,
    page = 1,
    filter,
    select,
}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
    const discounts = await discountModel
        .find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean();

    return discounts;
};

const checkDiscountExist = async (filter) => {
    return await discountModel.findOne(filter).lean()
}

module.exports = {
    findAllDiscountCodeSelect,
    findAllDiscountCodeUnselect,
    checkDiscountExist
}
