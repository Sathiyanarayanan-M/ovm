import Image from "next/image";
import Link from "next/link";
import React from "react";

const NavBar = () => {
  return (
    <nav className="bg-pr-bg shadow w-full h-[88px]">
      <div className=" px-6 py-4 mx-auto">
        <div className="flex items-center">
          <div className="flex items-center justify-between">
            <Link
              target="_blank"
              href="https://sathiyanarayanan-m.web.app/home?ref=ovm"
            >
              <Image
                className=""
                src="/assets/images/logo-tr.svg"
                alt="OVM"
                width={100}
                height={30}
                priority
              />
            </Link>
          </div>

          <div
            className={` inset-x-0 z-20 flex-1 w-full px-6 py-4 transition-all duration-300 ease-in-out bg-pr-bg mt-0 p-0 top-0 relative bg-transparent w-auto opacity-100 translate-x-0 flex items-center justify-end`}
          >
            <div className="flex justify-center mt-6 flex mt-0 -mx-2">
              <Link
                href="https://github.com/Sathiyanarayanan-M"
                aria-label="Github"
                target="_blank"
                className="mx-2 text-gray-600 transition-colors duration-300 transform hover:text-gray-500"
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
      </div>
    </nav>
  );
};

export default NavBar;
