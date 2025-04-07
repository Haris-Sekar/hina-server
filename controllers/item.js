import { Item, ItemGroup, Size, RateVersion, User } from "../models/index.js";
import { errorResponse, successResponse } from "../utils/responseFormatter.js";

// Item Controllers
const getAllItems = async (req, res) => {
    try {
        const {
            index = 1,
            range = 10,
            filters = {},
            sort_by = "created_time",
            sort_order = "DESC",
        } = req.query;

        const { count, rows } = await Item.findAndCountAll({
            where: {
                organization_id: req.user.organization_id,
                ...filters,
            },
            include: [
                { model: ItemGroup },
                { model: RateVersion, include: [Size] },
                { 
                    model: User, 
                    as: 'CreatedBy',
                    attributes: ['id', 'first_name', 'last_name', 'email']
                },
                { 
                    model: User, 
                    as: 'UpdatedBy',
                    attributes: ['id', 'first_name', 'last_name', 'email']
                }
            ],
            offset: (index - 1) * range,
            limit: range,
            order: [[sort_by, sort_order]],
        });

        return res.json(
            successResponse("Items fetched successfully", {
                items: rows,
                total: count,
            })
        );
    } catch (error) {
        return res.status(500).json(errorResponse(error.message));
    }
};

const createItem = async (req, res) => {
    try {
        const itemData = {
            ...req.body,
            organization_id: req.user.organization_id,
            created_by: req.user.id,
            updated_by: req.user.id,
        };

        const item = await Item.create(itemData);

        // Create initial inventory record
        if (item) {
            await Inventory.create({
                organization_id: req.user.organization_id,
                item_id: item.id,
                size_id: req.body.size_id,
                created_by: req.user.id,
                updated_by: req.user.id,
            });
        }

        return res.json(successResponse("Item created successfully", item));
    } catch (error) {
        return res.status(500).json(errorResponse(error.message));
    }
};

const updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = {
            ...req.body,
            updated_by: req.user.id,
            updated_time: Date.now(),
        };

        const item = await Item.findOne({
            where: {
                id,
                organization_id: req.user.organization_id,
            },
        });

        if (!item) {
            return res.status(404).json(errorResponse("Item not found"));
        }

        await item.update(updateData);
        return res.json(successResponse("Item updated successfully", item));
    } catch (error) {
        return res.status(500).json(errorResponse(error.message));
    }
};

const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await Item.findOne({
            where: {
                id,
                organization_id: req.user.organization_id,
            },
        });

        if (!item) {
            return res.status(404).json(errorResponse("Item not found"));
        }

        await item.update({ is_active: false, updated_by: req.user.id });
        return res.json(successResponse("Item deleted successfully"));
    } catch (error) {
        return res.status(500).json(errorResponse(error.message));
    }
};

// Item Group Controllers
// For ItemGroup getAllItemGroups
const getAllItemGroups = async (req, res) => {
    try {
        const {
            index = 1,
            range = 10,
            filters = {},
            sort_by = "created_time",
            sort_order = "DESC",
        } = req.query;

        const { count, rows } = await ItemGroup.findAndCountAll({
            where: {
                organization_id: req.user.organization_id,
                ...filters,
            },
            include: [
                { 
                    model: User, 
                    as: 'CreatedBy',
                    attributes: ['id', 'first_name', 'last_name', 'email']
                },
                { 
                    model: User, 
                    as: 'UpdatedBy',
                    attributes: ['id', 'first_name', 'last_name', 'email']
                }
            ],
            offset: (index - 1) * range,
            limit: range,
            order: [[sort_by, sort_order]],
        });

        return res.json(
            successResponse( {
                item_groups: rows,
                total: count,
            },"Item groups fetched successfully")
        );
    } catch (error) {
        return res.status(500).json(errorResponse(error.message));
    }
};

// For Size getAllSizes
const getAllSizes = async (req, res) => {
    try {
        const {
            index = 1,
            range = 10,
            filters = {},
            sort_by = "created_time",
            sort_order = "DESC",
        } = req.query;

        const { count, rows } = await Size.findAndCountAll({
            where: {
                organization_id: req.user.organization_id,
                ...filters,
            },
            include: [
                { 
                    model: User, 
                    as: 'CreatedBy',
                    attributes: ['id', 'first_name', 'last_name', 'email']
                },
                { 
                    model: User, 
                    as: 'UpdatedBy',
                    attributes: ['id', 'first_name', 'last_name', 'email']
                }
            ],
            offset: (index - 1) * range,
            limit: range,
            order: [[sort_by, sort_order]],
        });

        return res.json(
            successResponse("Sizes fetched successfully", {
                sizes: rows,
                total: count,
            })
        );
    } catch (error) {
        return res.status(500).json(errorResponse(error.message));
    }
};

// For RateVersion getAllRateVersions
const getAllRateVersions = async (req, res) => {
    try {
        const {
            index = 1,
            range = 10,
            filters = {},
            sort_by = "created_time",
            sort_order = "DESC",
        } = req.query;

        const { count, rows } = await RateVersion.findAndCountAll({
            where: {
                organization_id: req.user.organization_id,
                ...filters,
            },
            include: [
                { model: Item },
                { model: Size },
                { 
                    model: User, 
                    as: 'CreatedBy',
                    attributes: ['id', 'first_name', 'last_name', 'email']
                },
                { 
                    model: User, 
                    as: 'UpdatedBy',
                    attributes: ['id', 'first_name', 'last_name', 'email']
                }
            ],
            offset: (index - 1) * range,
            limit: range,
            order: [[sort_by, sort_order]],
        });

        return res.json(
            successResponse("Rate versions fetched successfully", {
                rateVersions: rows,
                total: count,
            })
        );
    } catch (error) {
        return res.status(500).json(errorResponse(error.message));
    }
};

const createItemGroup = async (req, res) => {
    try {
        const itemGroupData = {
            ...req.body,
            organization_id: req.user.organization_id,
            created_by: req.user.id,
            updated_by: req.user.id,
        };

        const itemGroup = await ItemGroup.create(itemGroupData);
        return res.json(successResponse("Item group created successfully", itemGroup));
    } catch (error) {
        return res.status(500).json(errorResponse(error.message));
    }
};

const updateItemGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = {
            ...req.body,
            updated_by: req.user.id,
            updated_time: Date.now(),
        };

        const itemGroup = await ItemGroup.findOne({
            where: {
                id,
                organization_id: req.user.organization_id,
            },
        });

        if (!itemGroup) {
            return res.status(404).json(errorResponse("Item group not found"));
        }

        await itemGroup.update(updateData);
        return res.json(successResponse("Item group updated successfully", itemGroup));
    } catch (error) {
        return res.status(500).json(errorResponse(error.message));
    }
};

const deleteItemGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const itemGroup = await ItemGroup.findOne({
            where: {
                id,
                organization_id: req.user.organization_id,
            },
        });

        if (!itemGroup) {
            return res.status(404).json(errorResponse("Item group not found"));
        }

        await itemGroup.destroy();
        return res.json(successResponse("Item group deleted successfully"));
    } catch (error) {
        return res.status(500).json(errorResponse(error.message));
    }
};

const createSize = async (req, res) => {
    try {
        const sizeData = {
            ...req.body,
            organization_id: req.user.organization_id,
            created_by: req.user.id,
            updated_by: req.user.id,
        };

        const size = await Size.create(sizeData);
        return res.json(successResponse("Size created successfully", size));
    } catch (error) {
        return res.status(500).json(errorResponse(error.message));
    }
};

const updateSize = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = {
            ...req.body,
            updated_by: req.user.id,
            updated_time: Date.now(),
        };

        const size = await Size.findOne({
            where: {
                id,
                organization_id: req.user.organization_id,
            },
        });

        if (!size) {
            return res.status(404).json(errorResponse("Size not found"));
        }

        await size.update(updateData);
        return res.json(successResponse("Size updated successfully", size));
    } catch (error) {
        return res.status(500).json(errorResponse(error.message));
    }
};

const deleteSize = async (req, res) => {
    try {
        const { id } = req.params;
        const size = await Size.findOne({
            where: {
                id,
                organization_id: req.user.organization_id,
            },
        });

        if (!size) {
            return res.status(404).json(errorResponse("Size not found"));
        }

        await size.update({ is_active: false, updated_by: req.user.id });
        return res.json(successResponse("Size deleted successfully"));
    } catch (error) {
        return res.status(500).json(errorResponse(error.message));
    }
};

const createRateVersion = async (req, res) => {
    try {
        const rateVersionData = {
            ...req.body,
            organization_id: req.user.organization_id,
            created_by: req.user.id,
            updated_by: req.user.id,
        };

        const rateVersion = await RateVersion.create(rateVersionData);
        return res.json(successResponse("Rate version created successfully", rateVersion));
    } catch (error) {
        return res.status(500).json(errorResponse(error.message));
    }
};

const updateRateVersion = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = {
            ...req.body,
            updated_by: req.user.id,
            updated_time: Date.now(),
        };

        const rateVersion = await RateVersion.findOne({
            where: {
                id,
                organization_id: req.user.organization_id,
            },
        });

        if (!rateVersion) {
            return res.status(404).json(errorResponse("Rate version not found"));
        }

        await rateVersion.update(updateData);
        return res.json(successResponse("Rate version updated successfully", rateVersion));
    } catch (error) {
        return res.status(500).json(errorResponse(error.message));
    }
};

const deleteRateVersion = async (req, res) => {
    try {
        const { id } = req.params;
        const rateVersion = await RateVersion.findOne({
            where: {
                id,
                organization_id: req.user.organization_id,
            },
        });

        if (!rateVersion) {
            return res.status(404).json(errorResponse("Rate version not found"));
        }

        await rateVersion.update({ is_active: false, updated_by: req.user.id });
        return res.json(successResponse("Rate version deleted successfully"));
    } catch (error) {
        return res.status(500).json(errorResponse(error.message));
    }
};

export {
    getAllItems,
    createItem,
    updateItem,
    deleteItem,
    getAllItemGroups,
    createItemGroup,
    updateItemGroup,
    deleteItemGroup,
    getAllSizes,
    createSize,
    updateSize,
    deleteSize,
    getAllRateVersions,
    createRateVersion,
    updateRateVersion,
    deleteRateVersion,
};