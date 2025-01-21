import { toast } from "sonner";
import http from "../api/http";
import PropTypes from 'prop-types';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../modules/context/AuthContext";

const AccessRightsRoutes = ({ element, requiredFormID }) => {
  const { accessToken } = useAuth()
  const [getAllData, setGetAllData] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const getUserClientData = async () => {
      try {
        const response = await http.get(`/access-rights?user_id=${accessToken.userID}`);
        setGetAllData(response.data[0]?.AccessRghtsFormID || null);
      } catch (error) {
        console.error('API Error:', error);
        toast.error('Connection failed!');
      }
    };
    getUserClientData();
  }, [accessToken]);
  useEffect(() => {
    if (getAllData !== null && getAllData !== requiredFormID) {
      navigate('/access-denied');
    }
  }, [getAllData, requiredFormID, navigate]);

  if (Number(getAllData) === Number(requiredFormID)) {
    return element;
  }
  return null; 
}
AccessRightsRoutes.propTypes = {
  requiredFormID: PropTypes.number.isRequired,
  element: PropTypes.element.isRequired,
};

export default AccessRightsRoutes;
