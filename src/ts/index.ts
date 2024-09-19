import * as _ from "lodash";

import axios from "axios";

import { type IProduct, Product } from "./Product";

const serverUrl = "http://localhost:5000";

function main() {
	const product = new Product();
	product.init(serverUrl);
}

document.addEventListener("DOMContentLoaded", main);
