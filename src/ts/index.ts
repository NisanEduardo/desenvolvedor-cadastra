import * as _ from "lodash";

import { Product } from "./Product";

const serverUrl = "http://localhost:5000";

function main() {
	const product = new Product();
	product.init(serverUrl);

	const mainHeader = document.querySelector("header");

	window.onscroll = () => {
		if (window.scrollY > 50) {
			mainHeader.classList.add("fixed");
		} else {
			mainHeader.classList.remove("fixed");
		}
	};
}

document.addEventListener("DOMContentLoaded", main);
