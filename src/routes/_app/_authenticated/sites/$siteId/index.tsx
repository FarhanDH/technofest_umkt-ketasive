import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/_authenticated/sites/$siteId/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { siteId } = Route.useParams();
	return <div>Hello from {siteId}!</div>;
}
