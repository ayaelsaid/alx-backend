import express from 'express';
import redis from 'redis';
import { promisify } from 'util';

const app = express();
const PORT = 1245;

const listProducts = [
  { Id: 1, name: 'Suitcase 250', price: 50, stock: 4 },
  { Id: 2, name: 'Suitcase 450', price: 100, stock: 10 },
  { Id: 3, name: 'Suitcase 650', price: 350, stock: 2 },
  { Id: 4, name: 'Suitcase 1050', price: 550, stock: 5 }
];

const client = const client = redis.createClient();

client.on('error', (err) => {
  console.error('Redis client error:', err);
});

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

async function reserveStockById(itemId, stock) {
  try {
    const redisKey = `item:${itemId}`;
    await setAsync(redisKey, stock);
    console.log(`Stock for item ${itemId} set to ${stock}`);
  } catch (err) {
    console.error('Error setting stock in Redis:', err);
  }
}

async function getCurrentReservedStockById(itemId) {
  try {
    const redisKey = `item:${itemId}`;
    const stock = await getAsync(redisKey);
    return stock ? parseInt(stock, 10) : 0; // Return 0 if no stock is reserved
  } catch (err) {
    console.error('Error getting stock from Redis:', err);
    throw err;
  }
}

app.get('/products', (req, res) => {
  const transformedProducts = listProducts.map(product => ({
    itemId: product.Id,
    itemName: product.name,
    price: product.price,
    initialAvailableQuantity: product.stock
  }));
  res.json(transformedProducts);
});

app.get('/list_products/:itemId', async (req, res) => {
  try {
    const itemId = parseInt(req.params.itemId, 10);
    const product = listProducts.find(p => p.Id === itemId);

    if (!product) {
      return res.status(404).json({ status: 'Product not found' });
    }

    const productStock = await getCurrentReservedStockById(itemId);

    res.json({
      itemId: product.Id,
      itemName: product.name,
      price: product.price,
      initialAvailableQuantity: product.stock,
      reservedStock: productStock
    });
  } catch (err) {
    res.status(500).json({ status: 'Failed to retrieve product information' });
  }
});

app.get('/reserve_product/:itemId', async (req, res) => {
  try {
    const itemId = parseInt(req.params.itemId, 10);
    const product = listProducts.find(p => p.Id === itemId);

    if (!product) {
      return res.status(404).json({ status: 'Product not found' });
    }

    let productStock = await getCurrentReservedStockById(itemId);

    if (productStock >= product.stock) {
      return res.status(404).json({ status: `Not enough stock available, itemId:${itemId}` });
    }

    await reserveStockById(itemId, productStock + 1);
    res.status(200).json({ status: `Reservation confirmed, itemId:${itemId}` });

  } catch (err) {
    console.error('Error processing reservation:', err);
    res.status(500).json({ status: 'Failed to process reservation' });
  }
});
