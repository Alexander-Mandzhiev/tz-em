import db from "../db.js";
class ShopsController {

    async create(req, res) {
        const { id, name } = req.body
        try {
            const result = await db.query('INSERT INTO shops (id, name, created_at) VALUES ($1, $2, $3) RETURNING *', [id, name, new Date()]);
            res.json(result.rows[0])
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }


    async getAll(req, res) {
        const search = req.query.search
        const word = `%${search}%`
        try {
            if (search == undefined) {
                const result = await db.query('SELECT * FROM shops')
                res.json(result.rows)
            } else {
                const result = await db.query('SELECT * FROM shops WHERE id = $1 OR name ILIKE $2', [search, word])
                res.json(result.rows)
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getOne(req, res) {
        const id = req.params.id
        try {
            const shops = await db.query("SELECT * FROM shops WHERE id = $1", [id])
            const product = await db.query(
                `SELECT products.plu, products.product, shelfs.shelfs
                FROM shelfs
                LEFT JOIN products 
                ON products.plu = shelfs.products_plu
                WHERE shelfs.shops_id = $1`, [id])

            const result = {
                shops: shops.rows[0],
                product: product.rows
            }
            res.json(result)
        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    }

    async update(req, res) {
        const id = req.params.id
        const { name } = req.body
        try {
            const result = await db.query('UPDATE shops SET name = $2  WHERE id = $1 RETURNING *', [id, name]);
            res.json(result.rows[0])
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        const id = req.params.id
        try {
            await db.query('DELETE FROM shops WHERE id = $1', [id]);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new ShopsController();