import { Button } from "@/components/button";
import { Carousel } from "@/components/image-display";
import { ContainerWithGradient } from "@/components/container";
import ImageLoaderWithCloudinary from "@/components/image-loader";
import { exploreLatest, images } from "@/lib/home-data";
import Link from "next/link";
import ProductsGrid from "@/components/products-grid";
import { ProductCard } from "@/components/product-card";
import {
	fetchAllProductsAction,
	fetchBulkProductsAction,
	fetchRetailProductsAction,
} from "@/app/actions/products";

/** Horizontal deal strip: three full cards in row width; extra items scroll. */
const homeDealsRowClassName =
	"mt-3.75 -mx-4 flex items-start gap-3.75 overflow-x-auto overscroll-x-contain scroll-smooth snap-x snap-mandatory px-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";
/** flex-basis matches gap-3.75 (0.9375rem): (100% − 2×gap) / 3 */
const homeDealsCardClassName =
	"shrink-0 snap-start w-[calc((100%-2*0.9375rem)/3)] flex-[0_0_calc((100%-2*0.9375rem)/3)]";

const Home = async () => {
	const [retailProducts, bulkProducts, allProducts] = await Promise.all([
		fetchRetailProductsAction(),
		fetchBulkProductsAction(),
		fetchAllProductsAction(),
	]);

	return (
		<div className="flex min-h-screen font-bricolage-grotesque items-center justify-center mt-2.5">
			<main className="min-h-screen w-full">
				<div className="px-4">
					<Carousel images={images}>
						<div className="max-w-40.5">
							<h2 className="font-semibold text-xs  text-white ">
								Grab Up to 50% Off On Your First Bulk Purchase
							</h2>
							<Link href={"/"}>
								<Button className="text-[7.95px]">shop now</Button>
							</Link>
						</div>
					</Carousel>
				</div>

				<div className="mt-10">
					<ContainerWithGradient
						description="gift for everyone- retail or bulk, customized or not"
						linkTo="/"
						title="gift shop deals"
					>
						<div className={homeDealsRowClassName}>
							{retailProducts.slice(0, 3).map(product => (
								<div key={product.id} className={homeDealsCardClassName}>
									<ProductCard
										details={product}
										variation="secondary"
									/>
								</div>
							))}
						</div>
					</ContainerWithGradient>
				</div>
				<div className="">
					<ContainerWithGradient
						description="your ideas, your prints, with printpadi"
						linkTo="/"
						title="custom printing deals"
					>
						<div className={homeDealsRowClassName}>
							{bulkProducts.slice(0, 3).map(product => (
								<div key={product.id} className={homeDealsCardClassName}>
									<ProductCard
										details={product}
										variation="secondary"
									/>
								</div>
							))}
						</div>
					</ContainerWithGradient>
				</div>

				
				{/* <div className="px-4">
					<ImageContainer
						darken={true}
						image="/flash.jpg"
						className="h-[259.2px]"
					>
						<div className="max-w-71.25 text-white flex flex-col space-y-4">
							<div>
								<h2 className="font-bold text-xs  text-white text-[25px]">
									Flash Sale!
								</h2>
								<p className="text-white text-xs">
									500 business cards from ₦4,000 - Premium matte finish included
								</p>
							</div>
							<div>
								<h3>
									<span className="text-[15px] font-medium">Ends in:</span>{" "}
									<span className="p-2.75 text-base max-w-10 font-bold bg-[#FFFFFF1A]/10 backdrop-blur-xs border-[0.5px] border-white/20 rounded-[4.81px]">
										05
									</span>
									:{" "}
									<span className="p-2.75 text-base max-w-10 font-bold bg-[#FFFFFF1A]/10 backdrop-blur-xs border-[0.5px] border-white/20 rounded-[4.81px]">
										10
									</span>
									:{" "}
									<span className="p-2.75 text-base max-w-10 font-bold bg-[#FFFFFF1A]/10 backdrop-blur-xs border-[0.5px] border-white/20 rounded-[4.81px]">
										55
									</span>
								</h3>
							</div>

							<Link href={"/"}>
								<Button className="flex items-center space-x-2 text-[17.95px] font-medium bg-[#FFFFFF1A]/10 backdrop-blur-xs border-[0.5px] border-white/20 rounded-[10.81px]">
									<span>order now</span>
									<ArrowCircleRight2 size="16" color="#FFFFFF" />
								</Button>
							</Link>
						</div>
					</ImageContainer>
				</div> */}
				<div className=" px-4 mt-4">
					<div className="flex items-center justify-between">
						<h2 className="capitalize">explore latest printing & branding</h2>
						<Link
							href={"/"}
							className="text-active-link font-sans font-medium text-xs"
						>
							View All
						</Link>
					</div>
					<div className="mt-11 grid grid-cols-2 justify-items-center justify-between gap-y-7.5 gap-x-auto">
						{exploreLatest.map(item => (
							<Link href={item.link} key={item.name}>
								<div className="flex flex-col space-y-3.5">
									<ImageLoaderWithCloudinary
										width={175}
										height={182}
										src={item.image}
									/>
									<h4 className="capitalize font-medium text-xs">
										{item.name}
									</h4>
								</div>
							</Link>
						))}
					</div>
				</div>
				<div className="mt-19.5 mb-13.75 px-4">
					<div className="flex items-center justify-between  mb-5.75">
						<h2 className="capitalize font-semibold ">explore products</h2>
						<Link
							href={"/"}
							className="text-active-link font-sans font-medium text-xs"
						>
							View All
						</Link>
					</div>
					<ProductsGrid products={allProducts} />
					
				</div>
			</main>
		</div>
	);
};

export default Home;
