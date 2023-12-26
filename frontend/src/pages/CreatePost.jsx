import React, { useState } from "react";
import { useCreatePostMutation } from "../slices/postsApiSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [createPost] = useCreatePostMutation();
  const { userInfo } = useSelector((state) => state.auth);
  console.log(userInfo.id);
  const id = userInfo.id;

  const navigate = useNavigate();
  const loadImage = (e) => {
    const imageReg = e.target.files[0];
    const obj = URL.createObjectURL(imageReg);
    console.log(obj);
    console.log(imageReg);
    setImage(imageReg);
  };

  const addPost = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("image", image);
    formData.append("user_id", id);

    // const data = {
    //   title: title,
    //   content: content,
    //   image: file,
    //   user_id: 1,
    // };

    try {
      await axios.post("/api/posts/create", formData, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      });
      // const res = await createPost({
      //   title,
      //   content,
      //   image,
      //   user_id: 1,
      // }).unwrap();

      // console.log(res);

      navigate("/posts");
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="w-[600px] mx-auto mt-8">
      <form
        className="bg-slate-100 p-6"
        onSubmit={addPost}
        encType="multipart/form-data"
      >
        <h1 className="my-3 text-3xl font-bold text-center"> Create Post</h1>
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
          <label htmlFor="image">Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={loadImage}
          />
        </div>
        <button
          className="py-1 bg-slate-900 text-white px-3 rounded-md mt-3"
          type="submit"
        >
          Add
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
