import BrandMark from "@/features/homepage/brand-mark";
import { containerClass } from "@/features/homepage/constants";

export default function SiteFooter() {
  return (
    <footer className="py-12">
      <div
        className={`${containerClass} grid gap-5 sm:grid-cols-2 lg:grid-cols-[1.2fr_repeat(3,minmax(0,1fr))]`}
      >
        <div>
          <a className="inline-flex items-center gap-3 text-xl font-extrabold" href="#">
            <BrandMark />
            SavoryCircle
          </a>
          <p className="mt-3 max-w-md text-[#565b64]">
            A recipe-sharing platform crafted for food lovers who care about taste, beauty, and
            connection.
          </p>
        </div>
        <div>
          <h4 className="mb-3 font-bold">Platform</h4>
          <a className="mb-2 block text-[#565b64] hover:text-[#cb3219]" href="#">
            Discover
          </a>
          <a className="mb-2 block text-[#565b64] hover:text-[#cb3219]" href="#">
            Top Creators
          </a>
          <a className="mb-2 block text-[#565b64] hover:text-[#cb3219]" href="#">
            Collections
          </a>
        </div>
        <div>
          <h4 className="mb-3 font-bold">Community</h4>
          <a className="mb-2 block text-[#565b64] hover:text-[#cb3219]" href="#">
            Challenges
          </a>
          <a className="mb-2 block text-[#565b64] hover:text-[#cb3219]" href="#">
            Workshops
          </a>
          <a className="mb-2 block text-[#565b64] hover:text-[#cb3219]" href="#">
            Forum
          </a>
        </div>
        <div>
          <h4 className="mb-3 font-bold">Company</h4>
          <a className="mb-2 block text-[#565b64] hover:text-[#cb3219]" href="#">
            About
          </a>
          <a className="mb-2 block text-[#565b64] hover:text-[#cb3219]" href="#">
            Careers
          </a>
          <a className="mb-2 block text-[#565b64] hover:text-[#cb3219]" href="#">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
