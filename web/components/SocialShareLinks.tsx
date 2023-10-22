"use client";

import {
  TwitterShareButton,
  FacebookShareButton,
  LinkedinShareButton,
} from "react-share";
import {
  AiFillFacebook,
  AiFillTwitterCircle,
  AiFillLinkedin,
} from "react-icons/ai";

const shareUrl = "https://www.calng.app/";
const title = "Calendar application of the future generation";

const SocialShareLinks = () => (
  <div className="mb-10 flex flex-wrap gap-x-10 gap-y-5 justify-center items-center text-black font-semibold">
    <TwitterShareButton
      url={shareUrl}
      title={title}
      className="bg-gradient-to-tr from-emerald-400 to-emerald-100 rounded-md shadow-md flex flex-col justify-center items-center"
    >
      <div className="px-10 py-2 text-2xl">
        <AiFillTwitterCircle />
      </div>
    </TwitterShareButton>
    <FacebookShareButton
      url={shareUrl}
      quote={title}
      className="bg-gradient-to-tr from-emerald-400 to-emerald-100 rounded-md shadow-md flex flex-col justify-center items-center"
    >
      <div className="px-10 py-2 text-2xl">
        <AiFillFacebook />
      </div>
    </FacebookShareButton>
    <LinkedinShareButton
      url={shareUrl}
      title={title}
      className="bg-gradient-to-tr from-emerald-400 to-emerald-100 rounded-md shadow-md flex flex-col justify-center items-center"
    >
      <div className="px-10 py-2 text-2xl">
        <AiFillLinkedin />
      </div>
    </LinkedinShareButton>
  </div>
);

export default SocialShareLinks;
