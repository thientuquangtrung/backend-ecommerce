const mongoose = require("mongoose"); // Erase if already required
const { default: slugify } = require("slugify");

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

// Declare the Schema of the Mongo model
const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        slug: String,
        thumb: {
            type: String,
            required: true,
        },
        description: String,
        price: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        type: {
            type: String,
            required: true,
            enum: ["Electronic", "Cloth", "Furniture"],
        },
        shop: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Shop",
        },
        attributes: {
            type: mongoose.SchemaTypes.Mixed,
            required: true,
        },
        // more
        rating: {
            type: Number,
            default: 4.5,
            min: [1, "Rating must be above 1.0"],
            max: [5, "Rating must be below 5.0"],
        },
        variations: {
            type: Array,
            default: [],
        },
        isDraft: {
            type: Boolean,
            default: true,
            index: true,
            select: false,
        },
        isPublished: {
            type: Boolean,
            default: false,
            index: true,
            select: false,
        },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);

// create index for search
productSchema.index({
    name: 'text',
    description: 'text'
})

// document middleware
productSchema.pre("save", function(next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

const clothSchema = new mongoose.Schema(
    {
        brand: {
            type: String,
            required: true,
        },
        size: String,
        material: String,
        shop: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Shop",
        },
    },
    {
        collection: "Clothes",
        timestamps: true,
    }
);

const electronicSchema = new mongoose.Schema(
    {
        manufacturer: {
            type: String,
            required: true,
        },
        model: String,
        color: String,
        shop: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Shop",
        },
    },
    {
        collection: "Electronics",
        timestamps: true,
    }
);

//Export the model
module.exports = {
    product: mongoose.model(DOCUMENT_NAME, productSchema),
    cloth: mongoose.model("Cloth", clothSchema),
    electronic: mongoose.model("Electronic", electronicSchema),
};
