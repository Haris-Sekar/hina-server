import Joi from "joi";

const createItem = Joi.object({
    item_group_id: Joi.number().required().messages({
        "number.base": "Item group ID must be a number",
        "any.required": "Item group ID is required",
    }),
    name: Joi.string().required().messages({
        "string.base": "Name should be a string",
        "any.required": "Name is required",
    }),
    description: Joi.string().allow("").optional(),
    sku: Joi.string().required().messages({
        "string.base": "SKU should be a string",
        "any.required": "SKU is required",
    }),
    barcode: Joi.string().allow("").optional(),
    has_size: Joi.boolean().default(false),
    unit_of_measure: Joi.string().required().messages({
        "string.base": "Unit of measure should be a string",
        "any.required": "Unit of measure is required",
    }),
    unit_of_bill: Joi.string().required().messages({
        "string.base": "Unit of bill should be a string",
        "any.required": "Unit of bill is required",
    }),
    reorder_point: Joi.number().default(0),
});

const createItemGroup = Joi.object({
    name: Joi.string().required().messages({
        "string.base": "Name should be a string",
        "any.required": "Name is required",
    }),
    description: Joi.string().allow("").optional(),
});

const createSize = Joi.object({
    name: Joi.string().required().messages({
        "string.base": "Name should be a string",
        "any.required": "Name is required",
    }),
    description: Joi.string().allow("").optional(),
});

const createRateVersion = Joi.object({
    item_id: Joi.number().required().messages({
        "number.base": "Item ID must be a number",
        "any.required": "Item ID is required",
    }),
    size_id: Joi.number().optional(),
    name: Joi.string().required().messages({
        "string.base": "Name should be a string",
        "any.required": "Name is required",
    }),
    rate: Joi.number().required().messages({
        "number.base": "Rate must be a number",
        "any.required": "Rate is required",
    }),
});

export default {
    "/api/v1/items/create": {
        schema: createItem,
        paramType: "body",
    },
    "/api/v1/items/update/:id": {
        schema: createItem,
        paramType: "body",
    },
    "/api/v1/items/groups/create": {
        schema: createItemGroup,
        paramType: "body",
    },
    "/api/v1/items/groups/update/:id": {
        schema: createItemGroup,
        paramType: "body",
    },
    "/api/v1/items/sizes/create": {
        schema: createSize,
        paramType: "body",
    },
    "/api/v1/items/sizes/update/:id": {
        schema: createSize,
        paramType: "body",
    },
    "/api/v1/items/rates/create": {
        schema: createRateVersion,
        paramType: "body",
    },
    "/api/v1/items/rates/update/:id": {
        schema: createRateVersion,
        paramType: "body",
    },
};