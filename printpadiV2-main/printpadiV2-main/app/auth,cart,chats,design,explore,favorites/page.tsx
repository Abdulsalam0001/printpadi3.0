import { fetchAllProductsAction } from "@/app/actions/products";
import FavoritesClient from "./favorites-client";

export default async function FavoritesPage() {
	const products = await fetchAllProductsAction();
	return <FavoritesClient products={products} />;
}
