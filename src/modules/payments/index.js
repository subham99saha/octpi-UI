import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import axios from "axios";
import useRazorpay from "react-razorpay";
import config from "../../config.json"

const Payments = () => {
    // console.log({key: process.env.REACT_APP_RZP_API_KEY})
    const params = useParams();
    const clientId = params.clientId

    const [name,setname] = useState('')
    const [email,setemail] = useState('')
    const [mobile,setmobile] = useState('')
    const [amount,setamount] = useState(0)
    const [orderId,setorderId] = useState('')

    const [payActive,setpayActive] = useState(false)
    const [isLoading,setisLoading] = useState(false)
    const [message,setmessage] = useState('')

    useEffect(() => {
        // console.log('fetching...')
        let obj = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${config.URL}/${config.ENDPOINT.USER}/check-amount/${clientId}/`,
            headers: { }
          };
          
          axios.request(obj)
          .then((response) => {
            if (response.data.success) {
                setamount(response.data.result.amountDue)
            }
          })
          .catch((error) => {
            console.log(error);
          });
    },[])

    const activatePay = () => {
        if (name !== '' && email !== '' && mobile !== '') {
            setisLoading(true)
            let data = JSON.stringify({
                "amount": amount * 100,
                "currency": "INR",
                "receipt": "Receipt no. 1"
            });
              
            let obj = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${config.URL}/${config.ENDPOINT.PAYMENT}/create-order/`,
                headers: { 
                  'Content-Type': 'application/json', 
                },
                data : data
            };
              
            axios.request(obj).then((response) => {
                console.log(response.data.message.id);
                setpayActive(true)
                setmessage('')
                setorderId(response.data.message.id)
                setisLoading(false)
            }).catch((error) => {
                console.log(error);
            });   
                     
        } else {
            setmessage('Fill all fields to proceed to payment')
        }
    }

    const [Razorpay] = useRazorpay();
    var options = {
        // "key": "rzp_test_u32ADs40LP5tTo", // Enter the Key ID generated from the Dashboard
        "key": process.env.REACT_APP_RZP_API_KEY, // Enter the Key ID generated from the Dashboard
        "amount": amount * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "OCTPI", //your business name
        "description": "Balance Due",
        "image": "https://example.com/your_logo",
        "order_id": orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": function (response) {
            console.log(response.razorpay_payment_id);
            console.log(response.razorpay_order_id);
            console.log(response.razorpay_signature)

            let data = JSON.stringify({
                "paymentId": response.razorpay_payment_id,
                "orderId": response.razorpay_order_id,
                "signature": response.razorpay_signature,
                clientId,
                amount,
                success: true
            });
              
            let obj = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${config.URL}/${config.ENDPOINT.PAYMENT}/record-payment/`,
                headers: { 
                  'Content-Type': 'application/json', 
                },
                data : data
            };
              
            axios.request(obj).then((response) => {
                console.log(response.data);
                setamount(0)
            }).catch((error) => {
                console.log(error);
            });
        },
        "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
            "name": name, //your customer's name
            "email": email, 
            "contact": mobile  //Provide the customer's phone number for better conversion rates 
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#e38f19"
        }
    };
    var rzp1 = new Razorpay(options);
    rzp1.on('payment.failed', function (response){
            const details = {
                code: response.error.code, 
                desc: response.error.description, 
                source: response.error.source, 
                step: response.error.step, 
                reason: response.error.reason
            }
            console.log({details})

            let data = JSON.stringify({
                "paymentId": response.error.metadata.payment_id,
                "orderId": response.error.metadata.order_id,
                clientId,
                amount,
                details,
                success: false
            });
              
            let obj = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${config.URL}/${config.ENDPOINT.PAYMENT}/record-payment/`,
                headers: { 
                  'Content-Type': 'application/json', 
                },
                data : data
            };
              
            axios.request(obj).then((response) => {
                console.log(response.data);
                setamount(0)
            }).catch((error) => {
                console.log(error);
            });
    });

    
    return (
        // <>
        // <div><button className="m-5" onClick={(e) => {rzp1.open(); e.preventDefault();}}>Pay Now</button></div>
        // </>
        <div className="flex-center mx-5">
            { (amount !== 0) ? <div className="w-full max-w-md p-6 bg-gray-200 rounded-lg shadow-lg">
            
            <div className='flex mb-5'>
                <div className='mx-2 font-semibold'>₹<span className="text-4xl font-semibold mb-6 ml-1">{amount}</span> </div>
                <div className='mx-2 text-sm'>{ (!payActive) ? 'Fill in name, email, and phone number to proceed to payment' : 'Select your desired payment method to complete the transaction'}</div>
            </div>
            { (!payActive) ? <>
                <form className='mt-3'>
                    <div className="mb-4">
                        {/* <label for="name" className="block text-gray-700 font-bold mb-2">Name</label> */}
                        <input type="text" id="name" name="name" className="form-input p-3 rounded w-full" placeholder="Name" 
                        value={name} onChange={(e) => setname(e.target.value)}
                        required />
                    </div>
                    <div className="mb-4">
                        {/* <label for="email" className="block text-gray-700 font-bold mb-2">Email</label> */}
                        <input type="email" id="email" name="email" className="form-input p-3 rounded w-full" placeholder="Email" 
                        value={email} onChange={(e) => setemail(e.target.value)}
                        required />
                    </div>
                    <div className="mb-4">
                        {/* <label for="phone" className="block text-gray-700 font-bold mb-2">Phone Number</label> */}
                        <input type="tel" id="phone" name="phone" className="form-input p-3 rounded w-full" placeholder="Mobile number" 
                        value={mobile} onChange={(e) => setmobile(e.target.value)}
                        required />
                    </div>
                </form></> : ''}
                    { (!payActive) ? <button type="" className="bg-orange-500 text-white font-bold py-2 px-4 rounded w-full" 
                    onClick={(e) => {activatePay(); e.preventDefault();}}
                        >{ (!isLoading) ? 'Confirm Details' : 'Loading...'}</button>
                    : <button type="" className="bg-green-500 text-white font-bold py-2 px-4 rounded w-full"
                    onClick={(e) => {rzp1.open(); e.preventDefault();}}
                        >Select Payment Method</button>}
                
                { (message !== '') ? <p className='font-thin text-xs mt-3'>{message}</p> : ''}
            </div> : 
            <div className='justify-center'>
                <div className="text-4xl font-semibold mb-6">No balance due</div>
                <div className="text-sm font-semibold mb-6">You have all your dues cleared.</div>
            </div>}            
        </div>
    )
}

export default Payments;