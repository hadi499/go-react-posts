import React, { useEffect, useState } from "react";
import { useGetPostsQuery } from "../slices/postsApiSlice";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import axios from "axios";

const Posts = () => {
  const { data, isLoading, error } = useGetPostsQuery();
  console.log(isLoading);

  const [posts, setPosts] = useState([]);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const getPosts = async () => {
  //     const res = await axios.get("/api/posts");

  //     console.log(res.data);
  //     setPosts(res.data.posts);
  //     setLoading(false);
  //   };
  //   getPosts();
  // }, []);

  return (
    <div className="w-[600px] mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-6">Halaman Posts</h1>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          {data.posts.map((post) => (
            <div key={post.id} className="mb-3 flex items-baseline gap-3">
              <div>
                <h1>
                  <Link
                    to={`/posts/${post.id}`}
                    className="text-2xl font-semibold hover:text-blue-400"
                  >
                    {post.title}
                  </Link>
                </h1>
              </div>
              <span>@{post.user.username}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Posts;
