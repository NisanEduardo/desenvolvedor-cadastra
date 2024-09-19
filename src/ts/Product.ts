import axios from "axios";

import { toCurrency } from "./utils/toCurrency";

export interface IProduct {
	id: string;
	name: string;
	price: number;
	parcelamento: Array<number>;
	color: string;
	image: string;
	size: string[];
	date: string;
}

export class Product {
	productListContainer: HTMLDivElement = document.querySelector(".shelf");

	async loadProducts(serverUrl: string) {
		const response = await axios.get(`${serverUrl}/products`);
		const products = await response.data;

		this.populateShelf(this.productListContainer, products);
	}

	async filterProducts(serverUrl: string) {
		this.html = "";

		const response = await axios.get(`${serverUrl}/products`);
		const products = await response.data;

		products.map((product: IProduct) => {
			if (product.color === "Cinza") {
				this.html += `
        <article class="shelf-item" key=${product.id}>
          <figure class="shelf-item__image">
            <img src="${product.image}" alt="${product.name}" />
          </figure>
          <div class="shelf-item__infos">
            <span class="shelf-item__infos--name">${product.name}</span>
            <span class="shelf-item__infos--price">${toCurrency(product.price)}</span>
            <span class="shelf-item__infos--installments">
            até ${product.parcelamento[0]}x de ${toCurrency(product.parcelamento[1])}</span>
          </div>
          <footer>
            <button type="button">Comprar</button>
          </footer>
        </article>
    `;
			}

			this.productListContainer.innerHTML = this.html;
		});
	}

	async sortProducts(selectOrderBy: HTMLSelectElement, serverUrl: string) {
		const response = await axios.get(`${serverUrl}/products`);
		const products = await response.data;

		let sortedProducts: IProduct[];

		switch (selectOrderBy.value) {
			case "Asc":
				sortedProducts = products.sort(
					(productA: IProduct, productB: IProduct) => {
						if (productA.price < productB.price) {
							return 1;
						} else {
							return -1;
						}
					},
				);
				break;

			case "lowerPrice":
				sortedProducts = products.sort(
					(productA: IProduct, productB: IProduct) => {
						if (productA.price > productB.price) {
							return 1;
						} else {
							return -1;
						}
					},
				);
				break;

			case "higherPrice":
				sortedProducts = products.sort(
					(productA: IProduct, productB: IProduct) => {
						if (productA.price < productB.price) {
							return 1;
						} else {
							return -1;
						}
					},
				);
				break;

			default:
				sortedProducts = products;
		}

		this.populateShelf(this.productListContainer, sortedProducts);
	}

	populateShelf(el: HTMLDivElement, items: IProduct[]) {
		let html = "";

		items.map((product: IProduct) => {
			html += `
          <article class="shelf-item" key=${product.id}>
            <figure class="shelf-item__image">
              <img src="${product.image}" alt="${product.name}" />
            </figure>
            <div class="shelf-item__infos">
              <span class="shelf-item__infos--name">${product.name}</span>
              <span class="shelf-item__infos--price">${toCurrency(product.price)}</span>
              <span class="shelf-item__infos--installments">
              até ${product.parcelamento[0]}x de ${toCurrency(product.parcelamento[1])}</span>
            </div>
            <footer>
              <button type="button">Comprar</button>
            </footer>
          </article>
      `;
		});

		el.innerHTML = html;
	}

	handleOpenSizeOptions(father: Element) {
		const target = father.children;

		if (target[1].classList.contains("active")) {
			target[1].classList.remove("active");
		} else {
			target[1].classList.add("active");
		}
	}

	init(serverUrl: string) {
		this.loadProducts(serverUrl);

		const selectOrderBy = document.getElementById(
			"OrderBy",
		) as HTMLSelectElement;

		const openFilterContextMenu = document.getElementsByClassName(
			"openFilterContextMenu",
		);

		selectOrderBy.onchange = () => this.sortProducts(selectOrderBy, serverUrl);

		Array.from(openFilterContextMenu).map((item) => {
			item.addEventListener("click", () => this.handleOpenSizeOptions(item));
		});
	}
}
