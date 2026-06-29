import { fetchChinaProductsAction } from "@/app/actions/products";
import SourceChinaScreen from "@/features/source-china/source-china-screen";

export default async function SourceChinaPage() {
	const products = await fetchChinaProductsAction();

	return <SourceChinaScreen products={products} />;
}
