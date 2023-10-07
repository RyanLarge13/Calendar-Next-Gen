import Image from "next/image";
import SocialLinks from "@/components/SocialLinks";
import SocialShareLinks from "@/components/SocialShareLinks"

const Footer = () => {
  return (
    <footer className="bg-black flex flex-col text-white justify-center items-center p-3">
      <Image
        src="/assets/favicon.svg"
        alt="logo"
        width={75}
        height={75}
        className="rounded-md shadow-md my-20"
      />
      <div className="">
        <ul className="grid grid-cols-2 place-items-start gap-x-10 gap-y-2 text-lg">
          <li>
            <a href="https://www.calng.app">CNG App</a>
          </li>
          <li>
            <a href="https://www.github.com/RyanLarge13/Calendar-Next-Gen">
              source code
            </a>
          </li>
          <li>
            <a href="https://www.github.com/RyanLarge13/Calendar-Next-Gen/blob/main/docs/CONTRIBUTING.md">
              contribute
            </a>
          </li>
          <li>
            <a href="https://www.cng-web.vercel.app/docs">docs</a>
          </li>
          <li>
            <a href="https://www.cng-web.vercel.app/about">about</a>
          </li>
          <li>
            <a href="https://www.cng-web.vercel.app/contact">contact</a>
          </li>
          <li>
            <a href="https://www.cng-web.vercel.app/termsofservice">terms</a>
          </li>
          <li>
            <a href="https://www.cng-web.vercel.app/privacypolicy">
              privacy policy
            </a>
          </li>
        </ul>
      </div>
      <SocialLinks />
      <SocialShareLinks />
    </footer>
  );
};

export default Footer;
