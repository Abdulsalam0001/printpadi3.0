import ExploreScreen from "@/features/explore/explore-screen";
import { getTagOptions } from "@/lib/tag-options-server";

export default async function ExplorePage() {
	const tagOptions = await getTagOptions();

	return <ExploreScreen tagOptions={tagOptions} />;
}
