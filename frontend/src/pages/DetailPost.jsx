import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { useDeletePostMutation } from "../slices/postsApiSlice";

const DetailPost = () => {
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [deletePost] = useDeletePostMutation();

  const { id } = useParams();

  useEffect(() => {
    const getPost = async () => {
      const res = await axios.get(`/api/posts/${id}`);
      //   const data = await res.json();
      console.log(res.data);
      setPost(res.data.post);
      setLoading(false);
    };
    getPost();
  }, [id]);
  const deleteP = async (postId) => {
    if (window.confirm("Are you sure you want to delete ?")) {
      try {
        // await axios.delete(`/api/posts/${postId}`);
        await deletePost(postId);
        navigate("/posts");
        window.location.reload();
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="w-[600px] mx-auto mt-10">
      {loading ? (
        <>
          <Loader />
        </>
      ) : (
        <>
          <img src={`http://localhost:8080/uploads/${post.image}`} alt="" />
          <h1>{post.title}</h1>
          <div className="mt-4">
            <button className="bg-green-700 text-white py-1 px-3 rounded-md mt-4 hover:opacity-80 mr-4">
              <Link to={`/posts/${post.id}/edit`}>edit</Link>
            </button>
            <button
              className="bg-red-600 px-3 py-1 rounded-md "
              onClick={() => deleteP(post.id)}
            >
              delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DetailPost;
