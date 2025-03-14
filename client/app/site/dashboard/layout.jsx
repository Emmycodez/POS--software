// import { AppSidebar } from "@/components/app-sidebar";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";
// import { Separator } from "@/components/ui/separator";
// import {
//   SidebarInset,
//   SidebarProvider,
//   SidebarTrigger,
// } from "@/components/ui/sidebar";
// import DashboardNavbar from "./_components/DashboardNavbar";

import { V0Sidebar } from "@/components/vosidebar";
import { Poppins } from "next/font/google";

// export default function DashboardLayout({ children }) {
//   return (
//     <div className="bg-blue-50">
//       <DashboardNavbar />
//       <SidebarProvider>
//         <AppSidebar />
//         <SidebarInset>
//           <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-blue-50">
//             <div className="flex items-center gap-2 px-4 bg-blue-50 ">
//               <SidebarTrigger className="-ml-1" />
//               <Separator orientation="vertical" className="mr-2 h-4" />
//               <Breadcrumb>
//                 <BreadcrumbList>
//                   <BreadcrumbItem className="hidden md:block">
//                     <BreadcrumbLink href="#">
//                       Building Your Application
//                     </BreadcrumbLink>
//                   </BreadcrumbItem>
//                   <BreadcrumbSeparator className="hidden md:block" />
//                   <BreadcrumbItem>
//                     <BreadcrumbPage>Data Fetching</BreadcrumbPage>
//                   </BreadcrumbItem>
//                 </BreadcrumbList>
//               </Breadcrumb>
//             </div>
//           </header>
//           <div className="bg-blue-50">{children}</div>
//         </SidebarInset>
//       </SidebarProvider>
//     </div>
//   );
// }

export const metadata = {
  title: "Dashboard",
  description:
    "An overview of your business and access to all software functionalities",
};


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default function layout({ children }) {
  return (
    <div className={`${poppins.className} flex h-screen bg-blue-50`}>
      <V0Sidebar />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
