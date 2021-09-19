import { useEffect, useState } from "react";
import { API } from "aws-amplify";
import { Container } from "@material-ui/core";
import { useUser } from "../context/AuthContext";
import { ListPostsQuery, Post } from "../API";
import { listPosts } from "../graphql/queries";
import PostPreview from "../components/PostPreview";

export default function Home() {
  const { user } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async (): Promise<Post[]> => {
      const allPosts = (await API.graphql({ query: listPosts })) as {
        data: ListPostsQuery;
        errors: any[];
      };

      if (allPosts.data) {
        setPosts(allPosts.data.listPosts.items as Post[]);
        return allPosts.data.listPosts.items as Post[];
      }
      throw new Error("Could not get posts");
    };

    fetchPosts();
  }, []);

  return (
    <Container maxWidth="md">
      {posts
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .map((post) => (
          <PostPreview key={post.id} post={post} />
        ))}
    </Container>
  );
}
