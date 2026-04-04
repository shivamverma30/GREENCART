import { assets, footerLinks } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const Footer = () => {
  const { isDarkMode } = useAppContext();

  return (
    <div className="footer-shell mt-24 px-6 font-sans md:px-16 lg:px-24 xl:px-32">
      <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-theme text-theme-primary">
        <div>
          <span className='logo-wrap'>
            <img className="w-34 md:w-32" src={isDarkMode ? assets.logo_dark : assets.logo} alt="Logo" />
          </span>
          <p className="max-w-[410px] mt-6 text-theme-secondary">
            We deliver fresh groceries and snacks straight to your door. Trusted by
            thousands, we aim to make your shopping experience simple and affordable.
          </p>
        </div>
        <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-base md:mb-5 mb-2">
                {section.title}
              </h3>
              <ul className="text-sm space-y-1">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a href={link.url} className="text-theme-secondary hover:text-primary transition">
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <p className="py-4 text-center text-sm md:text-base text-theme-secondary">
        Copyright {new Date().getFullYear()} © Greencart All Rights Reserved.
        <br />
        Made with <span className="text-red-500">❤️</span> by Shivam Verma
      </p>
    </div>
  );
};

export default Footer;
