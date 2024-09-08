import db from "../db.js";
class HistoryController {
    async getAll(req, res) {
        const date_start = req.query.date_start
        const date_end = req.query.date_end
        const plu = req.query.plu
        const shops_id = req.query.shops_id
        const action = req.query.action
        const limit = +req.query.limit
        const offset = +req.query.offset
        try {
            const conditions = [];
            const values = [];

            if (action) {
                conditions.push('action = $' + (values.length + 1));
                values.push(action);
            }
            if (shops_id) {
                conditions.push('shops_id = $' + (values.length + 1));
                values.push(shops_id);
            }
            if (plu) {
                conditions.push('plu = $' + (values.length + 1));
                values.push(plu);
            }
            if (date_start && date_end) {
                conditions.push('created_at BETWEEN $' + (values.length + 1) + ' AND $' + (values.length + 2));
                values.push(date_start, date_end);
            } else if (date_start) {
                conditions.push('created_at >= $' + (values.length + 1));
                values.push(date_start);
            } else if (date_end) {
                conditions.push('created_at <= $' + (values.length + 1));
                values.push(date_end);
            }

            const query = 'SELECT * FROM historyshop' +
                (conditions.length ? ' WHERE ' + conditions.join(' AND ') : '') +
                ' LIMIT $' + (values.length + 1) + ' OFFSET $' + (values.length + 2);

            values.push(limit, offset);

            const result = await db.query(query, values);
            res.json(result.rows);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new HistoryController();