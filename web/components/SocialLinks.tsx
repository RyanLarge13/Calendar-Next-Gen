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
      <a href="https://www.linkedin.com/in/ryan-large">
        <AiFillLinkedin />
      </a>
      <a href="#">
        <AiFillInstagram />
      </a>
      <a href="#">
        <AiFillTwitterCircle />
      </a>
      <a href="#">
        <AiFillFacebook />
      </a>
      <a href="https://github.com/RyanLarge13/Calendar-Next-Gen/">
        <AiFillGithub />
      </a>
    </div>
  );
};

export default SocialLinks;
