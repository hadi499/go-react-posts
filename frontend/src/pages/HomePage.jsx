import { useState, useEffect } from "react";

const HomePage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      const res = await fetch("/api/users/profile");
      const data = await res.json();
      setUsers(data.users);
    };
    getUsers();
  }, []);
  return (
    <div className="w-[400px] mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-8 text-center">User Profile</h1>

      {users.map((user) => (
        <div key={user.id} className="mb-4">
          <h1 className="text-xl font-semibold text-blue-600">
            {user.username}
          </h1>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
};

export default HomePage;
