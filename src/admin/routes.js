import Index from "../admin/views/Index";
import Account from "../admin/views/examples/Account";
import BlogManagement from '../admin/views/examples/BlogManagement';
import CategoryManagement from '../admin/views/examples/CategoryManagement';
import CityManagement from '../admin/views/examples/CityManagement';
import CountryManagement from '../admin/views/examples/CountryManagement';
import PlaceManagement from '../admin/views/examples/PlaceManagement';
import TagManagement from '../admin/views/examples/TagManagement';
import SubscriptionPrice from '../admin/views/examples/SubscriptionPrice';


var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/admin",
  },
  {
    path: "/account",
    name: "Users",
    component: <Account />,
    layout: "/admin",
  },
  {
    path: "/blog-management",
    name: "Blog Management",
    component: <BlogManagement />,
    layout: "/admin",
  },
  {
    path: "/category-management",
    name: "Category Management",
    component: <CategoryManagement />,
    layout: "/admin",
  },
  {
    path: "/city-management",
    name: "City Management",
    component: <CityManagement />,
    layout: "/admin",
  },
  {
    path: "/country-management",
    name: "Country Management",
    component: <CountryManagement />,
    layout: "/admin",
  },
  {
    path: "/place-management",
    name: "Place Management",
    component: <PlaceManagement />,
    layout: "/admin",
  },
  {
    path: "/tag-management",
    name: "Tag Management",
    component: <TagManagement />,
    layout: "/admin",
  },
  {
    path: "/price-management",
    name: "Price Management",
    component: <SubscriptionPrice />,
    layout: "/admin",
  },
];
export default routes;
