import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../context/AdminContextProvider'
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import assets from '../assets/assets';

const Orders = () => {

  const {token, currency} = useContext(AdminContext);

  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {

    if(!token) {
      return null
    }

    try {
      const {data: {success, orders, message}} = await axios.post(backendUrl + '/api/order/list', {}, {headers: {token}});

      if(success){
        setOrders(orders.reverse())
      }else{
        toast.error(message)
      }

    } catch (error) {
      console.log({error});
      toast.error(error.message);
    }
  }

  const statusHandler = async(event, orderId) => {
    try {
      const {data: {success, message}} = await axios.post(backendUrl + '/api/order/status', 
        {orderId, status: event.target.value}, {headers: {token}});

      if (success) {
        await fetchAllOrders();
      }else{
        toast.error(message);
      }
    } catch (error) {
      console.log({error});
      toast.error(error.message);          
    }
    

  }

  useEffect(() => {
    fetchAllOrders()
  }, []);

  return (
    <div>
      <h3>Orders Page</h3>
      <div className="">
        {
          orders?.map((order) => (
            <div className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700' key={order?._id}>
              <img className='w-12' src={assets.orderIcon} alt="" />
              <div>
                <div>
                  {
                    order?.items?.map((item, index) => {
                    if(index === order?.items?.length -1){
                      return (<p className='py-0.5' key={index}>{item.name} x {item.quantity} <span>{item.size}</span></p>)
                    }else{
                      return (<p className='py-0.5' key={index}>{item.name} x {item.quantity} <span>{item.size},</span></p>)
                    }
                    })
                  }
                </div>
                <p className='mt-3 mb-2 font-medium'>{order.address.firstName + " " + order.address.lastName}</p>
                <div>
                  <p>{order.address.street + ", " + order.address.city + ", " + order.address.state + ", " + order.address.country+ ", " + order.address.pincode}</p>
                </div>
                <p>{order.address.phone}</p>
              </div>
              <div>
                <p className='text-sm sm:text-[15px]'>Items: {order.items.length}</p>
                <p className='mt-3'>Payment Method: {order.paymentMethod}</p>
                <p>Payment: {order.payment ? 'Done' : 'Pending'}</p>
                <p>Date: {new Date(order.date)?.toLocaleDateString()}</p>
              </div>
              <p className='text-sm sm:text-[15px]'>{currency}{order.amount}</p>
              <select onChange={(event) => statusHandler(event, order?._id)} value={order.status} className='p-2 font-semibold'>
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Orders