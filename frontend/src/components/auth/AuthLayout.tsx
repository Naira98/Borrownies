import type { ReactNode } from "react";
import classNames from "classnames";
export default function AuthLayout({
  children,
  imgSrc,
  cardClassName,
}: {
  children: ReactNode;
  imgSrc: string;
  cardClassName?: string;
}) {
  return (
    <div className="bg-background relative flex h-screen w-screen flex-col items-center justify-start gap-4 p-4 md:justify-center">
      <img
        src="src/assets/dark-bg-logo.svg"
        className="relative top-0 left-0 mr-auto w-22 sm:block md:absolute md:top-4 md:left-4 md:w-28 lg:w-32"
      />
      <div className="flex w-full flex-1 items-center justify-center">
        <div
          className={classNames(
            "flex max-h-[calc(100vh-80px)] w-full max-w-5xl flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg",
            cardClassName,
          )}
        >
          <div className="relative w-full p-4 text-center">
            {/* <img
              src="src/assets/logo.svg"
              className="pointer-events-none absolute top-1/2 left-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 transform opacity-10 sm:hidden"
            /> */}

            <h2 className="text-primary relative z-10 text-2xl font-bold">
              Welcome to BookNook
            </h2>
          </div>
          <div className="flex flex-1 flex-col overflow-auto md:flex-row-reverse">
            <div className="hidden w-1/2 items-center justify-center md:flex">
              <img
                src={imgSrc}
                className="max-w-[80%] object-contain"
                alt="Books"
              />
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
