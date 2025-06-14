import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import { AppSidebar } from "./-components/site-sidebar";

export const Route = createFileRoute("/_app/_authenticated/sites/$siteId")({
	component: RouteComponent,
});

function RouteComponent() {
	const { siteId } = Route.useParams();
	return (
		<SidebarProvider>
			<AppSidebar siteId={siteId} />
			<SidebarInset>
				<Outlet />
			</SidebarInset>
		</SidebarProvider>
	);
}
