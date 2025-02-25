import {
    Module,
    User
} from "../models/index.js";
import {
    errorResponse,
    successResponse
} from "../utils/responseFormatter.js";

const getAllModules = async (req, res) => {
    try {
        const {
            id,
            index = 1,
            range = 10,
            filters = {},
            sort_by = "created_time",
            sort_order = "DESC",
        } = req.query;

        const {
            count,
            rows
        } = await Module.findAndCountAll({
            where: {
                ...filters,
                organization_id: req.org.id
            },
            limit: Number(range),
            offset: Number(index),
            order: [
                [sort_by, sort_order]
            ],
            include: [{
                model: User,
                as: "created_by_user"
            }, {
                model: User,
                as: "updated_by_user"
            }]
        });
        res.status(200).json(successResponse({
            page: {
                count,
                index,
                range
            },
            modules: rows
        }));
    } catch (error) {
        res.status(500).json(errorResponse("Failed to get all modules", [error], 500));
    }
}

const getMouldeCount = async (req, res) => {
    try {
        const {
            count
        } = await Module.findAndCountAll({
            where: {
                organization_id: req.org.id
            }
        })
        res.status(200).json(successResponse({
            count
        }));
    } catch (error) {
        res.status(500).json(errorResponse("Failed to get module count", [error], 500));
    }
}

const updateModule = async (req, res) => {
    try {
        const {
            id
        } = req.params;

        const {
            name,
            description,
            is_active,
        } = req.body;

        await Module.update({
            name,
            description,
            is_active,
            updated_by: req.user.id
        }, {
            where: {
                id,
                organization_id: req.org.id
            }
        });
        res.status(200).json(successResponse());
    } catch (error) {
        res.status(500).json(errorResponse("Failed to update module", [error], 500));
    }
}

export {
    getAllModules,
    updateModule,
    getMouldeCount
};