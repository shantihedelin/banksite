import Link from "next/link";

export default function Logo() {
  return (
    <>
      <Link
        className="text-2xl no-underline pl-3 flex justify-center items-center space-x-2"
        href={"/"}
      >
        <img
          className="w-12 h-12"
          src="data:image/png;base64,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"
        />
        <h1 className="text-xl text-black">Nova Bank </h1>
      </Link>
    </>
  );
}
