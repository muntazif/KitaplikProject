import {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';

const useFetch = (col, id) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const fetch = () => {
    switch (col) {
      case 'user':
        firestore()
          .collection('user')
          .doc(id)
          .get()
          .then(responseData => {
            if (responseData.data()) {
              setData(responseData.data());
              setLoading(false);
            }
          })
          .catch(err => {
            setError(err.code);
            setLoading(false);
          });
        break;

      case 'shared':
        firestore()
          .collection('shared')
          .onSnapshot(
            responseData => {
              if (responseData.docs) {
                setData(responseData.docs);
                setLoading(false);
              }
            },
            err => {
              setError(err.code);
              setLoading(false);
            },
          );
        break;

      case 'usershared':
        firestore()
          .collection('shared')
          .where('userId', '==', id)
          .onSnapshot(
            responseData => {
              if (responseData.docs) {
                setData(responseData.docs);
                counter(responseData.docs, id, col);
                setLoading(false);
              }
            },
            err => {
              setError(err.code);
              setLoading(false);
            },
          );
        break;

      case 'favorites':
        firestore()
          .collection('user')
          .doc(id)
          .collection('favorite')
          .onSnapshot(
            responseData => {
              if (responseData.docs) {
                setData(responseData.docs);
                counter(responseData.docs, id, col);
                setLoading(false);
              }
            },
            err => {
              setError(err.code);
              setLoading(false);
            },
          );
        break;
    }
  };

  const counter = (data, id, row) => {
    let total = 0;
    data.forEach(() => {
      total += 1;
    });
    const object = {
      [row]: total,
    };
    firestore().collection('user').doc(id).update(object);
  };

  useEffect(() => {
    fetch();
  }, []);
  
  
  return {loading, error, data};
};

export default useFetch;
