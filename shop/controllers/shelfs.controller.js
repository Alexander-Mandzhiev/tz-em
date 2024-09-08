import db from "../db.js";
import producer from "../producer.js";

class ShelfsController {

    async create(req, res) {
        const { products_plu, shops_id, shelfs } = req.body
        try {
            await db.query('BEGIN');
            const product = await db.query(`SELECT product FROM products WHERE plu = $1`, [products_plu])
            const shop = await db.query("SELECT name FROM shops WHERE id = $1", [shops_id])

            if (product.rows.length === 0 && shop.rows.length === 0) {
                await db.query('ROLLBACK');
                return res.status(404).json('Товар или магазин не существуют');
            }
            const result = await db.query(
                'INSERT INTO shelfs (products_plu, shops_id, shelfs) VALUES ($1, $2, $3) RETURNING *',
                [products_plu, shops_id, shelfs]);

            const message = {
                plu: products_plu,
                ...product.rows[0],
                shop_id: shops_id,
                ...shop.rows[0],
                count: shelfs,
                created_at: new Date(),
            }
            await producer.publishMessage("create shelfs", message)
            await db.query('COMMIT');

            res.json(result.rows[0])
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getOne(req, res) {
        const products_plu = req.params.products_plu
        const shops_id = req.params.shops_id
        try {
            const result = await db.query("SELECT * FROM shelfs WHERE products_plu = $1 AND shops_id = $2", [products_plu, shops_id])
            res.json(result.rows[0])
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        const products_plu = req.params.products_plu
        const shops_id = req.params.shops_id
        const { shelfs } = req.body
        try {
            await db.query('BEGIN');
            const shelfsResult = await db.query("SELECT shelfs FROM shelfs WHERE products_plu = $1 AND shops_id = $2", [products_plu, shops_id]);
            if (shelfsResult.rows.length === 0) {
                await db.query('ROLLBACK');
                return res.status(404).json('Товар не найден на складе');
            }
            const result = await db.query('UPDATE shelfs SET shelfs = $3 WHERE products_plu = $1 AND shops_id = $2 RETURNING *',
                [products_plu, shops_id, shelfs]);
            const product = await db.query(`SELECT product FROM products WHERE plu = $1`, [products_plu])
            const shop = await db.query("SELECT name FROM shops WHERE id = $1", [shops_id])
            const message = {
                plu: products_plu,
                ...product.rows[0],
                shop_id: shops_id,
                ...shop.rows[0],
                count: shelfs,
                created_at: new Date(),
            }
            await producer.publishMessage("update shelfs", message)
            await db.query('COMMIT');
            res.json(result.rows[0])
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async increase(req, res) {
        const products_plu = req.params.products_plu
        const shops_id = req.params.shops_id
        const { shelfs } = req.body
        try {
            await db.query('BEGIN');
            const shelfsResult = await db.query("SELECT shelfs FROM shelfs WHERE products_plu = $1 AND shops_id = $2", [products_plu, shops_id]);
            if (shelfsResult.rows.length === 0) {
                await db.query('ROLLBACK');
                return res.status(404).json('Товар не найден на складе');
            }
            const currentShelfs = shelfsResult.rows[0].shelfs;
            const newShelfs = currentShelfs + shelfs;
            const result = await db.query('UPDATE shelfs SET shelfs = $3 WHERE products_plu = $1 AND shops_id = $2 RETURNING *',
                [products_plu, shops_id, newShelfs]);
            const product = await db.query(`SELECT product FROM products WHERE plu = $1`, [products_plu])
            const shop = await db.query("SELECT name FROM shops WHERE id = $1", [shops_id])
            const message = {
                plu: products_plu,
                ...product.rows[0],
                shop_id: shops_id,
                ...shop.rows[0],
                count: shelfs,
                created_at: new Date(),
            }
            await producer.publishMessage("increase in stock", message)
            await db.query('COMMIT');
            res.json(result.rows[0])
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async decrease(req, res) {
        const products_plu = req.params.products_plu
        const shops_id = req.params.shops_id
        const { shelfs } = req.body
        try {
            await db.query('BEGIN');
            const shelfsResult = await db.query("SELECT shelfs FROM shelfs WHERE products_plu = $1 AND shops_id = $2", [products_plu, shops_id]);
            if (shelfsResult.rows.length === 0) {
                await db.query('ROLLBACK');
                return res.status(404).json('Товар не найден на складе');
            }

            const currentShelfs = shelfsResult.rows[0].shelfs;
            if (currentShelfs >= shelfs) {
                const newShelfs = currentShelfs - shelfs;
                const result = await db.query('UPDATE shelfs SET shelfs = $3 WHERE products_plu = $1 AND shops_id = $2 RETURNING *',
                    [products_plu, shops_id, newShelfs]);
                const product = await db.query(`SELECT product FROM products WHERE plu = $1`, [products_plu])
                const shop = await db.query("SELECT name FROM shops WHERE id = $1", [shops_id])
                const message = {
                    plu: products_plu,
                    ...product.rows[0],
                    shop_id: shops_id,
                    ...shop.rows[0],
                    count: shelfs,
                    created_at: new Date(),
                }
                await producer.publishMessage("decrease in stock", message)
                await db.query('COMMIT');
                res.json(result.rows[0])
            } else {
                await db.query('ROLLBACK');
                return res.status(400).json('Недостаточно товаров на складе');
            }

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        const products_plu = req.params.products_plu
        const shops_id = req.params.shops_id
        try {
            await db.query('DELETE FROM shelfs WHERE products_plu = $1 AND shops_id = $2', [products_plu, shops_id]);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new ShelfsController();