import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Users, Search } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { CreatePostDialog } from "./CreatePostDialog";
import { NotificationsMenu } from "./navbar/NotificationsMenu";
import { UserMenu } from "./navbar/UserMenu";

export const Navbar = () => {
  const session = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <Users className="w-8 h-8 text-primary transition-colors duration-200 group-hover:text-secondary" />
            <span className="text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors duration-200">
              Отец Молодец
            </span>
          </Link>
          
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 transition-colors duration-200 group-hover:text-primary" />
              <input
                type="text"
                placeholder="Поиск обсуждений..."
                className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 border-none focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200 group-hover:bg-gray-200"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <NotificationsMenu />
                <CreatePostDialog />
                <UserMenu />
              </>
            ) : (
              <Button asChild className="animate-fade-in hover:animate-bounce-subtle">
                <Link to="/auth">Войти</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};