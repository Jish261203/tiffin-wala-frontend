import { Link } from "react-router-dom";
import MobileNav from "./MobileNav";
import MainNav from "./MainNav";
import logo from '../assets/TiffinWalaLogo.png'

const Header = () => {
  return (
    <div className="border-b-2 border-b-orange-500 py-6">
      <div className="container mx-auto flex justify-between items-center">
      <Link to="/" className="flex gap-1.5 items-center">
					<img src={logo} className="h-[70px] object-contain" alt="" />
					<h1 className="text-3xl font-bold tracking-tighter font-mono">
						Tiffin Wala
					</h1>
				</Link>
        <div className="md:hidden">
          <MobileNav />
        </div>
        <div className="hidden md:block">
          <MainNav />
        </div>
      </div>
    </div>
  );
};

export default Header;
