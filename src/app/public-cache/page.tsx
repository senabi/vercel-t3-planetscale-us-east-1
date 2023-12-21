import Link from "next/link";

import { CreatePost } from "@/app/_components/create-post";
import { api } from "@/trpc/server";
import { unstable_cache, unstable_noStore } from "next/cache";

export default async function Home() {
  unstable_noStore();
  const hello = await api.post.hello.query({ text: "from tRPC" });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
        </h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
            href="https://create.t3.gg/en/usage/first-steps"
            target="_blank"
          >
            <h3 className="text-2xl font-bold">First Steps →</h3>
            <div className="text-lg">
              Just the basics - Everything you need to know to set up your
              database and authentication.
            </div>
          </Link>
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
            href="https://create.t3.gg/en/introduction"
            target="_blank"
          >
            <h3 className="text-2xl font-bold">Documentation →</h3>
            <div className="text-lg">
              Learn more about Create T3 App, the libraries it uses, and how to
              deploy it.
            </div>
          </Link>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-2xl text-white">
            {hello ? hello.greeting : "Loading tRPC query..."}
          </p>
        </div>

        <CrudShowcase />
      </div>
    </main>
  );
}

const getLatestPost = unstable_cache(
  () => api.post.getLatest.query(),
  undefined,
  {
    tags: ["post.getLatest"],
  },
);

const getCachedTimeInfinity = unstable_cache(
  () => Promise.resolve(new Date()),
  undefined,
  {
    tags: ["time"],
  },
);

const getCachedTime2min = unstable_cache(
  () => Promise.resolve(new Date()),
  undefined,
  {
    tags: ["time-2min"],
    revalidate: 120,
  },
);

async function CrudShowcase() {
  unstable_noStore();
  const [cachedInfTime, cached2minTime] = await Promise.all([
    getCachedTimeInfinity(),
    getCachedTime2min(),
  ]);
  const start = Date.now();
  const latestPost = await getLatestPost();
  const duration = Date.now() - start;

  return (
    <div className="w-full max-w-xs">
      <div>Vecel functions at (Node.js) (us-east-1 Virginia) </div>
      <p>Time inf: {cachedInfTime.toString()}</p>
      <p>Time 2min: {cached2minTime.toString()}</p>
      {latestPost ? (
        <p className="truncate">Your most recent post: {latestPost.name}</p>
      ) : (
        <p>You have no posts yet.</p>
      )}
      <div>unstable_cache</div>
      Drizzle + PlanetScale (us-east-1 Virginia) {duration}ms
      <CreatePost />
    </div>
  );
}
