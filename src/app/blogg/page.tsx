import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";

const prisma = new PrismaClient();

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
}

async function getPosts() {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return posts;
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Blog Posts</h1>
      <div className="space-y-8">
        {posts.map((post: Post) => (
          <div
            key={post.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <Image
              src={post.imageUrl}
              alt={post.title}
              width={800}
              height={400}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">{post.title}</h2>
              <div className="prose max-w-none">{post.content}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <Link
          href="/create-post"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create New Post
        </Link>
      </div>
    </div>
  );
}
