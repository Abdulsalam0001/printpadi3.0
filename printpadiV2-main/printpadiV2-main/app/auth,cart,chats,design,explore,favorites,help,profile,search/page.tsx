import SearchResultsScreen from "@/features/search/search-results-screen";
import { fetchProductsSearchAction } from "@/app/actions/products";
import { getTagOptions } from "@/lib/tag-options-server";

type SearchParams = Promise<{ q?: string | string[]; tag?: string | string[] }>;

function firstParam(value: string | string[] | undefined): string {
	if (typeof value === "string") {
		return value.trim();
	}
	if (Array.isArray(value)) {
		return (value[0] ?? "").trim();
	}
	return "";
}

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
	const params = await searchParams;
	const q = firstParam(params.q);
	const tag = firstParam(params.tag);

	const [products, tagOptions] = await Promise.all([
		fetchProductsSearchAction({ q, tag }),
		getTagOptions(),
	]);

	const tagLabel = tag ? (tagOptions.find(o => o.slug === tag)?.name ?? tag) : null;

	return (
		<SearchResultsScreen
			products={products}
			initialQuery={q}
			initialTagSlug={tag || null}
			tagLabel={tagLabel}
		/>
	);
}
