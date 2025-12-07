const { fetch, create, update } = require('../models/container');
const AppError = require('../utils/AppError');

async function fetchContainerController (req, res, next) {
    try {
        if (!req.query.unique_number) {
            throw new AppError('unique number not present', 'CLIENT_ERROR');
        }
        const container = await fetch({
            unique_number: req.query.unique_number
        });
        res.status(200).json({
            status: 'success',
            data: container,
        });
    }
    catch(err) {
        next(err);
    }
}

async function createContainerController (req, res, next) {
    try {
        const params = req.body || {};
        if (!params.unique_number) {
            throw new AppError('unique number not present', 'CLIENT_ERROR');
        }
        const paramsToSend = {
            length : Number(params.length) || 0,
            breadth: Number(params.breadth) || 0,
            height: Number(params.height) || 0,
            unique_number: params.unique_number,
        }
        const volumetricCapacity = paramsToSend.length * paramsToSend.breadth*paramsToSend.height;
        paramsToSend.volumetric_capacity = volumetricCapacity || 0;
        const container = await create(paramsToSend);
        res.status(200).json({
            status: 'success',
            data: container,
        });
    }
    catch(err) {
        next(err);
    }
}

async function updateContainerController (req, res, next) {
    try {
        const params = req.body || {};
        if (!params.unique_number) {
            throw new AppError('unique number not present', 'CLIENT_ERROR');
        }
        const paramsToSend = {
            vendor_name: params.vendor_name,
            port_name: params.port_name,
            grid: params.grid,
            zone: params.zone,
            status: params.status,
            unique_number: params.unique_number
        } = params;
        const container = await update(paramsToSend);
        res.status(200).json({
            status: 'success',
            data: container,
        });
    }
    catch(err) {
        next(err);
    }
}

module.exports = {
    createContainerController,
    updateContainerController,
    fetchContainerController
}