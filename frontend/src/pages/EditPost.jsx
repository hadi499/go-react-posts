import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const EditPost = () => {
  const [post, setPost] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [file, setFile] = useState("");
  const [oldImage, setOldImage] = useState("");
  const { id } = useParams();

  useEffect(() => {
    const getPost = async () => {
      const res = await axios.get(`/api/posts/${id}`);
      const data = await res.data.post;
      setPost(data);
      setTitle(data.title);
      setContent(data.content);
      setOldImage(data.image);
    };
    getPost();
  }, [id]);

  const navigate = useNavigate();
  const loadImage = (e) => {
    const imageReg = e.target.files[0];
    console.log(imageReg);
    setFile(imageReg);
  };

  const editPost = async (e) => {
    e.preventDefault();

    const userId = 3;
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("image", file);
    formData.append("user_id", userId);

    const formData2 = new FormData();
    formData2.append("title", title);
    formData2.append("content", content);
    formData2.append("oldImage", oldImage);
    formData2.append("user_id", userId);

    const data = {
      title: title,
      content: content,
      image: file,
      user_id: 1,
    };
    const data2 = {
      title: title,
      content: content,
      image: oldImage,
      user_id: 1,
    };
    const updateData = loadImage == null ? data2 : data;

    try {
      await axios.patch(`/api/posts/${id}`, formData, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      });
      navigate("/posts");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="w-[600px] mx-auto mt-8">
      <form className="bg-slate-100 p-6" onSubmit={editPost}>
        <h1 className="my-3 text-3xl font-bold text-center"> Edit Post</h1>
        <div className="flex flex-col gap-2 text-xl">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            className="px-3 py-1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            cols="30"
            rows="10"
            className="p-2"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          <input type="hidden" value={oldImage} />
          <label htmlFor="image">Image</label>
          <input type="file" name="image" onChange={loadImage} />
        </div>
        <button
          className="py-1 bg-slate-900 text-white px-3 rounded-md mt-3 hover:opacity-80"
          type="submit"
        >
          Edit
        </button>
      </form>
    </div>
  );
};

export default EditPost;
