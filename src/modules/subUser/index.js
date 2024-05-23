import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import axios from "axios";
import config from "../../config.json"

const SubUser = () => {
    const params = useParams();
    const clientId = params.clientId
    const username = params.username

    const [image,setimage] = useState('')
    const [avatar,setavatar] = useState('')
    const [message,setmessage] = useState('')

    const [reload,setreload] = useState(0)
    
    useEffect(() => {
        let obj = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${config.URL}/${config.ENDPOINT.SUBUSER}/${clientId}/${username}/`,
            headers: { }
        };
        
        axios.request(obj)
        .then((response) => {
            if (response.data.success) {
                console.log(response.data)
                setavatar(response.data.message.image)
            }
        })
        .catch((error) => {
            console.log(error);
        });
    },[reload])

    const submit = () => {
        if (image !== '') {
            console.log({image})
            var formData = new FormData();
            formData.append('clientId', clientId);
            formData.append('username', username);
            formData.append('avatar', image[0]);

            for (var [key, value] of formData.entries()){
                console.log(key,value);
            }
            axios.post(`${config.URL}/${config.ENDPOINT.SUBUSER}/add-profile-pic/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
            }).then((result)=>{
                console.log(result.data)
                // setavatar(result.data.result.image)
                setmessage(result.data.message)
                setimage('')
                setreload(reload + 1)
            }).catch(err => {
                console.log({err})
            });  
        } else {
            setmessage('Select an image first')
        }
    }

    return (
        // <>
        // <div><button className="m-5" onClick={(e) => {rzp1.open(); e.preventDefault();}}>Pay Now</button></div>
        // </>
        <div className="flex-center mx-5">
            <div className="w-full max-w-md p-6 bg-gray-200 rounded-lg shadow-lg">
            
            <div className='flex gap-x-5'>
                <div style={{
                    backgroundImage: `url(${config.URL}/images/${avatar})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }} className='aspect-square w-24 h-24 bg-gray-500'>

                </div>

                <div className='mb-5'>
                    <div className='text-xl font-semibold'><span className="">{clientId}</span> - <span className="">{username}</span></div>
                    <span className='text-sm'>Select an image and click on update</span>                    
                </div>
            </div>
            <>
                <form className='mt-3'>
                    <div className="mb-4">
                        {/* <label for="name" className="block text-gray-700 font-bold mb-2">Name</label> */}
                        <input type="file" id="image" name="image" className="form-input rounded w-full" placeholder="Image" 
                        onChange={(e) => setimage(e.target.files)}
                        required />
                    </div>
                </form>
            </>
                {(image !== '') ? <button type="" className="bg-orange-500 text-white font-bold py-1 px-4 rounded w-full" 
                onClick={(e) => { e.preventDefault(); submit(); }}
                >Update Profile Pic</button>
                : <button type="" disabled className="inactive bg-gray-300 text-gray-200 font-bold py-1 px-4 rounded w-full" 
                >Update Profile Pic</button>}
                
                { (message !== '') ? <p className='font-thin text-xs mt-3'>{message}</p> : ''}
            </div>           
        </div>
    )
}

export default SubUser;