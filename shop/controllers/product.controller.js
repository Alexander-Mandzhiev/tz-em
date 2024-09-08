import db from "../db.js";
class ProductController {
    async create(req, res) {
        const { plu, product } = req.body
        try {
            const result = await db.query('INSERT INTO products (plu, product, created_at) VALUES ($1, $2, $3) RETURNING *', [plu, product, new Date()]);
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
                const result = await db.query('SELECT * FROM products')
                res.json(result.rows)
            } else {
                const result = await db.query('SELECT * FROM products WHERE plu = $1 OR product ILIKE $2', [search, word])
                res.json(result.rows)
            }

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getOne(req, res) {
        const plu = req.params.plu
        try {
            const product = await db.query(`
                SELECT products.plu, products.product, products.created_at 
                FROM products
                WHERE products.plu = $1`, [plu])
            const shops = await db.query(
                `SELECT shops.name, shelfs.shelfs
                FROM shelfs
                LEFT JOIN shops 
                ON shops.id = shelfs.shops_id
                WHERE shelfs.products_plu = $1`, [plu])

            const result = {
                product: product.rows[0],
                shops: shops.rows
            }
            res.json(result)

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        const plu = req.params.plu
        const { product } = req.body
        try {
            const result = await db.query('UPDATE products SET product = $2 WHERE plu = $1 RETURNING plu, product, created_at', [plu, product]);
            res.json(result.rows[0])
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        const plu = req.params.plu
        try {
            await db.query('DELETE FROM products WHERE plu = $1', [plu]);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new ProductController();