"use client";
import { constants } from "@/constants/constants";
import Link from "next/link";
import { useEffect, useState } from "react";

const getCurrentYear = () => new Date().getFullYear();

export const Footer = () => {
  const [currentYear, setCurrentYear] = useState<number>(getCurrentYear());

  useEffect(() => {
    setCurrentYear(getCurrentYear());
  }, []);
  return (
    <footer className="bg-muted py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Us Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {constants.footerdata.footerOne.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {constants.footerdata.footerOne.abouts}
            </p>
          </div>

          {/* Quick Links Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {constants.footerdata.footerTwo.title}
            </h3>
            <ul className="space-y-2">
              {constants.footerdata.footerTwo.linksData.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.url}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow Us Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {constants.footerdata.footerThree.title}
            </h3>
            <div className="flex space-x-4">
              {constants.footerdata.footerThree.linksData.map((link, index) => (
                <Link
                  key={index}
                  href={link.url}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d={link["path"]} />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="mt-8 pt-8 border-t border-muted-foreground/10 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} MM3-DIGITAL. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};