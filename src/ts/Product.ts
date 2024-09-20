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
	productListContainerEl: HTMLDivElement = document.querySelector(".shelf");
	loadMoreProductsButton = document.getElementById("loadMoreProducts");
	openFilterByEl = document.getElementById("openFilterBy");
	filterByContextHeaderEl = document.getElementsByClassName(
		"filterByContext--container__header",
	);
	filterByContextContainerEl = document.getElementsByClassName(
		"filterByContext--container",
	);

	page = 0;
	productsPerPage = 6;
	allProducts: IProduct[] = [];
	slicedProducts: IProduct[] = [];

	async getProducts(serverUrl: string) {
		const response = await axios.get(`${serverUrl}/products`);
		this.allProducts = await response.data;
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

		this.populateShelf(
			this.productListContainerEl,
			sortedProducts,
			this.handleAddItemOnCart,
		);
	}

	populateShelf(el: HTMLDivElement, items: IProduct[], callBack?: () => void) {
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
              <button class="buttonBuy" type="button">Comprar</button>
            </footer>
          </article>
      `;
		});

		el.innerHTML = html;

		callBack();
	}

	handleOpenSizeOptions(sibling: Element) {
		const target = sibling.parentNode.children;

		if (target[1].classList.contains("active")) {
			target[1].classList.remove("active");
		} else {
			target[1].classList.add("active");
		}
	}

	handleAddItemOnCart() {
		const itensOnCartEl: HTMLElement = document.getElementById("itensOnCart");
		let itensOnCartCounter: number = Number(itensOnCartEl.innerText);

		const buttonsAddToCart = Array.from(
			document.getElementsByClassName("buttonBuy"),
		);

		for (const item of buttonsAddToCart) {
			item.addEventListener("click", () => {
				itensOnCartCounter++;

				itensOnCartEl.innerHTML = String(itensOnCartCounter);
			});
		}
	}

	handleLoadMorePosts() {
		const nextPage = this.page + this.productsPerPage;
		const nextProducts: IProduct[] = this.allProducts.slice(
			nextPage,
			nextPage + this.productsPerPage,
		);

		this.page = nextPage;

		this.slicedProducts = [...this.slicedProducts, ...nextProducts];

		this.populateShelf(
			this.productListContainerEl,
			this.slicedProducts,
			() => false,
		);

		if (this.slicedProducts.length >= this.allProducts.length) {
			this.loadMoreProductsButton.setAttribute("disabled", "disabled");
		}
	}

	handleOpenFilters() {
		this.filterByContextContainerEl[0].classList.add("active");
	}

	handleCloseFilters() {
		this.filterByContextContainerEl[0].classList.remove("active");
	}

	init(serverUrl: string) {
		try {
			this.getProducts(serverUrl).then(() => {
				this.slicedProducts = this.allProducts.slice(
					this.page,
					this.productsPerPage,
				);

				this.populateShelf(
					this.productListContainerEl,
					this.slicedProducts,
					() => false,
				);
			});
		} catch (err) {
			console.error(err);
		}

		this.loadMoreProductsButton.addEventListener("click", () =>
			this.handleLoadMorePosts(),
		);

		this.openFilterByEl.addEventListener("click", () =>
			this.handleOpenFilters(),
		);

		this.filterByContextHeaderEl[0].addEventListener("click", () =>
			this.handleCloseFilters(),
		);

		const selectOrderBy = document.getElementById(
			"OrderBy",
		) as HTMLSelectElement;

		const openFilterContextMenu = Array.from(
			document.getElementsByClassName("openFilterContextMenu"),
		);

		selectOrderBy.onchange = () => this.sortProducts(selectOrderBy, serverUrl);

		openFilterContextMenu.map((item) => {
			item.addEventListener("click", () => this.handleOpenSizeOptions(item));
		});

		if (this.page + this.productsPerPage > this.allProducts.length) {
			this.loadMoreProductsButton.removeAttribute("disabled");
		}
	}
}
