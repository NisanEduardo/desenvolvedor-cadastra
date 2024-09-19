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
	productListContainer = document.querySelector(".shelf");

	html = "";

	toCurrency = new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	});

	async loadProducts(products: Promise<IProduct[]>) {
		(await products).map((product: IProduct) => {
			this.html += `
          <article class="shelf-item" key=${product.id}>
            <figure class="shelf-item__image">
              <img src="${product.image}" alt="${product.name}" />
            </figure>
            <div class="shelf-item__infos">
              <span class="shelf-item__infos--name">${product.name}</span>
              <span class="shelf-item__infos--price">${this.toCurrency.format(product.price)}</span>
              <span class="shelf-item__infos--installments">${product.parcelamento}</span>
            </div>
            <footer>
              <button type="button">Comprar</button>
            </footer>
          </article>
      `;
		});

		this.productListContainer.innerHTML = this.html;
	}
}
