"use client";

import {
  AiFillGithub,
  AiFillFacebook,
  AiFillTwitterCircle,
  AiFillInstagram,
  AiFillLinkedin,
} from "react-icons/ai";

const SocialLinks = () => {
  return (
    <div className="flex flex-wrap gap-y-4 gap-x-10 justify-center items-center mb-10 mt-20 text-3xl">
      <AiFillLinkedin />
      <AiFillInstagram /> <AiFillTwitterCircle /> <AiFillFacebook />
      <AiFillGithub />
    </div>
  );
};

export default SocialLinks;
