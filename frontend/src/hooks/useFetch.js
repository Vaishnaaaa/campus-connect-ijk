// frontend/src/hooks/useFetch.js
import { useState, useEffect, useCallback } from "react";

/**
 * Generic data-fetching hook.
 * @param {Function} fetchFn  - async function that returns an axios response
 * @param {Array}    deps     - dependency array (re-fetches when changed)
 * @param {boolean}  skip     - set true to defer the initial fetch
 */
const useFetch = (fetchFn, deps = [], skip = false) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState(null);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchFn();
      setData(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, deps); // eslint-disable-line

  useEffect(() => {
    if (!skip) run();
  }, [run, skip]);

  return { data, loading, error, refetch: run };
};

export default useFetch;
