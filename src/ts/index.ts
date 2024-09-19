import * as _ from "lodash";

import axios from "axios";

import { type IProduct, Product } from "./Product";

const serverUrl = "http://localhost:5000";

function main() {
	const product = new Product();

	const getProducts = async () => {
		const response = await axios.get(`${serverUrl}/products`);
		const products = await response.data;

		return products;
	};

	try {
		getProducts().then((response: Promise<IProduct[]>) =>
			product.loadProducts(response),
		);
	} catch (err) {
		console.error(err);
	}
}

document.addEventListener("DOMContentLoaded", main);
