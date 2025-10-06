import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Database,
  Users,
  Shield,
  Settings,
  LogOut,
  ChevronDown,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface NavItem {
  title: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: { title: string; href: string }[];
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Data Management",
    icon: Database,
    children: [
      { title: "Overview", href: "/data-management/overview" },
      { title: "Analytics", href: "/data-management/analytics" },
    ],
  },
  {
    title: "User Table",
    icon: Users,
    children: [
      { title: "All Users", href: "/user-table/all-users" },
      { title: "Inactive", href: "/user-table/inactive" },
    ],
  },
  {
    title: "Admin Table",
    icon: Shield,
    children: [
      { title: "Admins", href: "/admin-table/admins" },
      { title: "Permissions", href: "/admin-table/permissions" },
    ],
  },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const isActive = (href: string) => location.pathname === href;

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-border transition-transform duration-300",
        "lg:translate-x-0",
        !isOpen && "-translate-x-full lg:translate-x-0"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="h-16 flex items-center px-4">
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <Home className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xl font-bold">Sholas</span>
          </Link>
        </div>

        <Separator />

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => (
            <div key={item.title}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleExpanded(item.title)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent",
                      expandedItems.includes(item.title) && "bg-accent"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </div>
                    <motion.div
                      animate={{
                        rotate: expandedItems.includes(item.title) ? 180 : 0,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {expandedItems.includes(item.title) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="ml-7 mt-1 space-y-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              to={child.href}
                              onClick={onClose}
                              className={cn(
                                "block px-3 py-2 rounded-md text-sm transition-colors hover:bg-accent",
                                isActive(child.href) &&
                                  "bg-primary text-primary-foreground hover:bg-primary/90"
                              )}
                            >
                              {child.title}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to={item.href!}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent",
                    isActive(item.href!) &&
                      "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>

        <Separator />

        <div className="p-4 space-y-2">
          <Button variant="ghost" className="w-full justify-start " asChild>
            <Link to="/settings" className="w-full flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
}
