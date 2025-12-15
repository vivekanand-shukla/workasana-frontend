// useCRUD.js Bearer
import { useState } from "react";
import axios from "axios";

const useCRUD = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const CRUD = (method, url, data = null) => {
    setLoading(true);
    setError(null);
 const token = localStorage.getItem("token");
    return axios({ method, url, data  , headers: {
        Authorization: `${token}`,
      }})
      .then(res => res.data)
      .catch(err => {
        setError(err.response?.data?.message || err.message);
        return null;
      })
      .finally(() => setLoading(false));
  };

  return { CRUD, loading, error };
};

export default useCRUD;
