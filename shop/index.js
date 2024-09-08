import express from "express"
import productRouter from "./service/product.service.js";
import shopRouter from "./service/shops.service.js";
import shelfsRouter from "./service/shelfs.service.js";
import ordersRouter from "./service/orders.service.js";

const PORT = process.env.PORT || 5000;

const app = express()

app.use(express.json())

app.use('', productRouter)
app.use('', shopRouter)
app.use('', shelfsRouter)
app.use('', ordersRouter)

app.listen(PORT, () => console.log(`server starting on port:` + PORT))