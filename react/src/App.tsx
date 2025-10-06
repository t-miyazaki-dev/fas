import { useState } from 'react';

import axios from "axios"


export default function App(){
  const [id, setId] = useState("")
  const [user,setUser] = useState<any>(null)
  const [error,setError] = useState("")

  const handleGetUser = async () => {
    try {
      // setError("")
      const res = await axios.get(`http://localhost:3000/user/${id}`)
      setUser(res.data)
    }catch(err){
      // setUser(null)
      setError("見つかりません")
    }
  }

  return(
    <div>
      <h1>User Search</h1>
      <input
      type="number"
      value={id}
      onChange={(e) => setId(e.target.value)}
      placeholder='ユーザーIDを入力'
      />
      <button onClick={handleGetUser}>検索</button>
      
      {user && (
        <div>
          <h2>ユーザ情報</h2>
          <p>ID: {user.id}</p>
          <p>名前: {user.name}</p>
          <p>年齢:{user.age}</p>
        </div>
      )}

      {error && <p>{error}</p>}
    </div>

  )




}


