import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-pr-bg">
      <div className="container px-6 py-8 mx-auto">
        <hr className="my-6 border-pr-text md:my-10" />

        <div className="flex flex-col items-center sm:flex-row sm:justify-between">
          <p className="text-sm text-pr-text">
            © Copyright {new Date().getFullYear()}. All Rights Reserved.
          </p>

          <div className="flex -mx-2">
            <Link
              className="mx-2 transition-colors duration-300 "
              href="https://github.com/Sathiyanarayanan-M"
              aria-label="Github"
              target="_blank"
            >
              <Image
                src="/assets/icons/github-mark.svg"
                alt="github"
                width={24}
                height={24}
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
