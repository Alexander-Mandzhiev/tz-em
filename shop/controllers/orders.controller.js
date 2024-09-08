import db from "../db.js";
import producer from "../producer.js";

class OrdersController {
    async create(req, res) {
        const { count, completed, products_plu, shops_id } = req.body
        try {
            await db.query('BEGIN');
            const shelfsResult = await db.query("SELECT shelfs FROM shelfs WHERE products_plu = $1 AND shops_id = $2", [products_plu, shops_id]);
            if (shelfsResult.rows.length === 0) {
                await db.query('ROLLBACK');
                return res.status(404).json('Товар не найден на складе');
            }
            const currentShelfs = shelfsResult.rows[0].shelfs;
            const newShelfs = currentShelfs - count;
            if (currentShelfs >= count) {
                const insertResult = await db.query(`INSERT INTO orders (count, completed, products_plu, shops_id, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
                    [count, completed, products_plu, shops_id, new Date()]);
                await db.query('UPDATE shelfs SET shelfs = $1 WHERE products_plu = $2 AND shops_id = $3 RETURNING *;',
                    [newShelfs, products_plu, shops_id]
                );
                const product = await db.query(`SELECT product FROM products WHERE plu = $1`, [products_plu])
                const shop = await db.query("SELECT name FROM shops WHERE id = $1", [shops_id])
                const message = {
                    plu: products_plu,
                    ...product.rows[0], 
                    shop_id: shops_id,
                    ...shop.rows[0], 
                    count,
                    created_at: new Date(),
                }

                await producer.publishMessage("create order", message)
                await db.query('COMMIT');
                return res.json(insertResult.rows[0]);
            } else {
                await db.query('ROLLBACK');
                return res.status(400).json('Недостаточно товаров на складе');
            }
        } catch (error) {
            await db.query('ROLLBACK');
            return res.status(500).json({ error: error.message });
        }
    }

    async getAll(req, res) {
        const completed = req.query.completed
        const products_plu = req.query.products_plu
        const shops_id = req.query.shops_id
        try {
            const result = await db.query('SELECT * FROM orders WHERE completed = $1 OR products_plu = $2 OR shops_id = $3', [completed, products_plu, shops_id])
            res.json(result.rows)

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getOne(req, res) {
        const id = req.params.id
        try {
            const result = await db.query("SELECT * FROM orders WHERE id = $1", [id])
            res.json(result.rows[0])
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        const id = req.params.id
        const { completed } = req.body
        try {
            const result = await db.query('UPDATE orders SET completed = $2 WHERE id = $1 RETURNING *',
                [id, completed]);
            res.json(result.rows[0])
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        const id = req.params.id
        try {
            await db.query('DELETE FROM orders WHERE id = $1', [id]);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new OrdersController();