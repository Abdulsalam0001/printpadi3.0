import { fetchProductByIdAction } from "@/app/actions/products";
import { ProductDetailScreen } from "@/features/product/product-detail-screen";
import { notFound } from "next/navigation";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params;
	const details = await fetchProductByIdAction(id);

	if (!details) {
		notFound();
	}

	return <ProductDetailScreen details={details} />;
};

export default page;
