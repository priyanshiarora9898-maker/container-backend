const Transaction = require('../config/db/Transaction');
const { pool } = require('../config/db/db');
const AppError = require('../utils/AppError');

async function fetch(params) {
    let query = `
        SELECT 
        c.id,
        c.unique_number,
        c.volumetric_capacity,
        c.status,
        v.name AS vendor_name,
        p.id AS port_id,
        p.country AS current_port_country,
        z.name AS zone_name,
        c.current_grid
        FROM container c
        LEFT JOIN vendor v ON c.vendor_id = v.id
        LEFT JOIN port p ON c.current_port_id = p.id
        LEFT JOIN zone z ON c.current_zone_id = z.id 
    `;
    const queryParams = [];
    if (params.id) {
        query+=`WHERE id = $1`; 
        queryParams.push(params.id);
    }
    else if (params.unique_number) {
        query+='WHERE unique_number = $1';
        queryParams.push(params.unique_number);
    }
    const res = await pool.query(query, queryParams);

    return res.rows[0];

}

async function create(params) {
    const {
        length,
        breadth,
        height,
        volumetric_capacity = 0,
        unique_number = null,
    } = params;
    let txn;
    try {
        txn = new Transaction();
        await txn.begin();
        const query = `
            INSERT INTO container (length, breadth, height, volumetric_capacity, unique_number) VALUES ($1, $2, $3, $4, $5) RETURNING *;
        `;
        const result = await txn.query(query, [length, breadth, height, volumetric_capacity, unique_number]);
        await txn.commit();
        return result.rows[0];
    }
    catch(err) {
        if (txn) await txn.rollback();
        throw err;
    }
}

async function update(params) {
    const {
        vendor_name,
        port_name,
        grid,
        zone,
        status,
        unique_number
    } = params;

    if (!unique_number) {
        throw new AppError('No Container Unique Number')
    }

    let txn;
    try {
        txn = new Transaction();
        await txn.begin();
        const updateFields = [];
        const updateValues = [];
        let idx = 1;
        if (status) {
            updateFields.push(`status = $${idx++}`);
            updateValues.push(status);
        }
        if (vendor_name) {
            const vendorRes = await txn.query(
                `SELECT id FROM vendor WHERE name = $1 LIMIT 1`,
                [vendor_name]
            );

            if (vendorRes.rows.length) {
                updateFields.push(`vendor_id = $${idx++}`);
                updateValues.push(vendorRes.rows[0].id);
            }
        }
        if (port_name) {
            const portRes = await txn.query(
                `SELECT id FROM port WHERE name = $1 LIMIT 1`,
                [port_name]
            );
            if (portRes.rows.length) {
                updateFields.push(`current_port_id = $${idx++}`);
                updateValues.push(portRes.rows[0].id);
            }
        }
        if (zone) {
            const zoneRes = await txn.query(
                `SELECT id FROM zone WHERE name = $1 LIMIT 1`,
                [zone]
            );
            if (zoneRes.rows.length) {
                updateFields.push(`current_zone_id = $${idx++}`);
                updateValues.push(zoneRes.rows[0].id);
            }
        }
        if (grid) {
            updateFields.push(`current_grid = $${idx++}`);
            updateValues.push(grid);
        }
        if (updateFields.length === 0) {
            throw new AppError('No fields to update', 'CLIENT_ERR');
        }
        updateValues.push(unique_number);

        const finalQuery = `
            UPDATE container
            SET ${updateFields.join(', ')}
            WHERE unique_number = $${idx}
            RETURNING *;
        `;

        const result = await txn.query(finalQuery, updateValues);

        await txn.commit();
        return result.rows[0];
    }
    catch(err) {
        if (txn) await txn.rollback();
        throw err;
    } 
}

module.exports = {
    create,
    update,
    fetch
}