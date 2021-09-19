import React, { ReactElement, useEffect, useState } from "react";
import { GetStaticProps, GetStaticPaths } from "next";
import { withSSRContext } from "aws-amplify";
import { Container } from "@material-ui/core";

import { listPosts, getPost } from "../../graphql/queries";
import { ListPostsQuery, GetPostQuery, Post, Comment } from "../../API";

import PostPreview from "../../components/PostPreview";
import PostComment from "../../components/PostComment";

interface Props {
  post: Post;
}

export default function IndividualPost({ post }: Props): ReactElement {
  const [comments, setComments] = useState<Comment[]>(post.comments.items as Comment[]);

  useEffect(() => {
    if (post.comments) {
      setComments(post.comments.items);
    }
  }, [post]);

  console.log("Got post:", post);

  return (
    <Container maxWidth="md">
      <PostPreview post={post} />

      {comments
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .map((comment) => (
          <PostComment key={comment.id} comment={comment} />
        ))}
    </Container>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // Call an external API endpoint to get posts.
  const SSR = withSSRContext();

  const postsQuery = (await SSR.API.graphql({
    query: getPost,
    variables: {
      id: params.id,
    },
  })) as { data: GetPostQuery };

  // By returning { props: { posts } }, the Individual Post component
  // will receive `post` as a prop at build time
  return {
    props: {
      post: postsQuery.data.getPost as Post,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 1, // In seconds
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const SSR = withSSRContext();

  const response = (await SSR.API.graphql({ query: listPosts })) as {
    data: ListPostsQuery;
    errors: any[];
  };

  // Get the paths we want to pre-render based on posts
  const paths = response.data.listPosts.items.map((post) => ({
    params: { id: post.id },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: blocking } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: "blocking" };
};
