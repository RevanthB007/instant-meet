import React from 'react'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
const LandingPage = () => {
    const router = useRouter();
    const [name, setName] = useState('');

  return (
    <div>
        <input type="text" onChange={(e) => setName(e.target.value)} />
        <button onClick={()=>{
            router.push(`/room/${name}`);
        }}>Join</button>
    </div>
  )
}

export default LandingPage