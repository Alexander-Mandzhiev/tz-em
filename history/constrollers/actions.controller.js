import db from "../db.js";
class ActionController {
    async createOrder(message) {
        try {
            const { plu, product, shop_id, name, count, created_at } = message
            await db.query('INSERT INTO historyshop (plu, product, shops_id, shop, count, created_at, action) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
                [plu, product, shop_id, name, count, created_at, "create_order"]);
            await db.query('INSERT INTO historyshop (plu, product, shops_id, shop, count, created_at, action) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
                [plu, product, shop_id, name, count, created_at, "decrease_in_stock"]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async increaseInStock(message) {
        try {
            const { plu, product, shop_id, name, count, created_at } = message
            await db.query('INSERT INTO historyshop (plu, product, shops_id, shop, count, created_at, action) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
                [plu, product, shop_id, name, count, created_at, "increase_in_stock"]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async decreaseInStock(message) {
        try {
            const { plu, product, shop_id, name, count, created_at } = message
            await db.query('INSERT INTO historyshop (plu, product, shops_id, shop, count, created_at, action) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
                [plu, product, shop_id, name, count, created_at, "decrease_in_stock"]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async createShelfs(message) {
        try {
            const { plu, product, shop_id, name, count, created_at } = message
            await db.query('INSERT INTO historyshop (plu, product, shops_id, shop, count, created_at, action) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
                [plu, product, shop_id, name, count, created_at, "create_shelfs"]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateShelfs(message) {
        try {
            const { plu, product, shop_id, name, count, created_at } = message
            await db.query('INSERT INTO historyshop (plu, product, shops_id, shop, count, created_at, action) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
                [plu, product, shop_id, name, count, created_at, "update_shelfs"]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new ActionController();