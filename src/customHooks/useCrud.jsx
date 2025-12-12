// useCRUD.js
import { useState } from "react";
import axios from "axios";

const useCRUD = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const CRUD = (method, url, data = null) => {
    setLoading(true);
    setError(null);

    return axios({ method, url, data })
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
