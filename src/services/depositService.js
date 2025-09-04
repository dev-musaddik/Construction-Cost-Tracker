import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'https://construction-cost-tracker-server-g2xg-4mnituoop.vercel.app/api/deposits/';

const getDeposits = async () => {
  console.log('[depositService] GET all deposits:', API_URL);
  try {
    const response = await axios.get(API_URL, { headers: authHeader() });
    console.log('[depositService] Response:', response.data);
    return response;
  } catch (error) {
    console.error('[depositService] Error in getDeposits:', error);
    throw error;
  }
};

const getDeposit = async (id) => {
  console.log('[depositService] GET deposit by ID:', id);
  try {
    const response = await axios.get(API_URL + id, { headers: authHeader() });
    console.log('[depositService] Response:', response.data);
    return response;
  } catch (error) {
    console.error(`[depositService] Error in getDeposit(${id}):`, error);
    throw error;
  }
};

const createDeposit = async (description, amount,date) => {
  console.log('[depositService] CREATE deposit:', { description, amount,date });
  try {
    const response = await axios.post(API_URL, { description, amount,date }, { headers: authHeader() });
    console.log('[depositService] Response:', response.data);
    return response;
  } catch (error) {
    console.error('[depositService] Error in createDeposit:', error);
    throw error;
  }
};

const updateDeposit = async (id, description, amount ,date) => {
  console.log('[depositService] UPDATE deposit:', { id, description, amount, date });
  try {
    const response = await axios.put(API_URL + id, { description, amount,date }, { headers: authHeader() });
    console.log('[depositService] Response:', response.data);
    return response;
  } catch (error) {
    console.error(`[depositService] Error in updateDeposit(${id}):`, error);
    throw error;
  }
};

const deleteDeposit = async (id) => {
  console.log('[depositService] DELETE deposit ID:', id);
  try {
    const response = await axios.delete(API_URL + id, { headers: authHeader() });
    console.log('[depositService] Response:', response.data);
    return response;
  } catch (error) {
    console.error(`[depositService] Error in deleteDeposit(${id}):`, error);
    throw error;
  }
};

const depositService = {
  getDeposits,
  getDeposit,
  createDeposit,
  updateDeposit,
  deleteDeposit,
};

export default depositService;
