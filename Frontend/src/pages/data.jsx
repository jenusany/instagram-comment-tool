import React, { useState, useEffect, useRef } from "react";
import "./data.css";
import Loading from "./loading.jsx";
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

function Data(commentArr) {

  console.log(commentArr["commentArr"])

  const [date, setDate] = useState();

  const [chartSize, setChartSize] = useState(window.innerWidth * 0.6 * 0.8);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth * 0.6;
      setChartSize(newWidth * 0.8); // 80% of the new container width
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call to set size

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const [positiveArray, setpositiveArray] = useState([])
  const [negativeArray, setnegativeArray] = useState([])

const [loading, setLoading] = useState(true);


function sendDataToServer(data){
  const fetchData = async (data) => {
    const response = await fetch('https://buzz-builder.com//process', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
  });
  
  if (response.ok) {
      const processedData = await response.json();
      setpositiveArray(processedData["Positive"])
      setnegativeArray(processedData["Negative"])
  } else {
      console.error('Error:', response.statusText);
  }
  /**
   * setpositiveArray(["testing pos"])
  setnegativeArray(["testing neg"])
   */
    return new Promise(resolve => {
      setTimeout(() => {
        resolve("Data loaded");
      }, 500);
    });
  };

  fetchData(data).then(response => {
    setLoading(false);
  });
}

function dateDifference(date1, date2) {
  // Create Date objects for both dates
  const firstDate = new Date(date1);
  const secondDate = new Date(date2);
  
  // Calculate the difference in milliseconds
  const differenceInMilliseconds = secondDate - firstDate;
  
  // Convert milliseconds to days
  const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
  
  return differenceInDays;
}

const [text, setText] = useState("");


useEffect(() => {
  sendDataToServer({ list:commentArr["commentArr"][0]});
}, [commentArr])

useEffect(() => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // Months are zero-indexed
  const day = currentDate.getDate();
  const diff = dateDifference(commentArr["commentArr"][2].slice(0,commentArr["commentArr"][2].indexOf("T")), `${year}-${month}-${day}`)

  //console.log(diff)

  if(diff <= 7){
    setText(`This post is ${Math.round(diff)} days old. \n Instagram posts are displayed on users feeds for 7 days, which means this post is still reaching accounts!`)
  }else{
    setText(`This post is ${Math.round(diff)} days old. Instagram posts are displayed on users feeds for 7 days, which means this post is no longer reaching accounts.`)
  }
})

const COLORS = ["#84f542", '#e85867'];
const data = [
    { name: 'Positive', value: positiveArray.length },
    { name: 'Negative', value: negativeArray.length },
  ];

  const [commentArray, setCommentArray] = useState(["Click on a Section of the Pie Chart to view Comments"]);

  function pieChartClick(index){
    if(index === 0){
      setCommentArray(positiveArray)
    }else{
      setCommentArray(negativeArray)
    }
  }

  if (loading) {
    return <Loading />;
  }else{
    return (
      <>
      <h1 className="title">Post Analysis</h1>
      <div className="likes">
        <p>{commentArr["commentArr"][1]} Total Likes</p>
        <p>{text}</p>
      </div>
      <br></br>
      <h1 className="title">Comment Analysis</h1>
      <div className="pie">
      <div ref={containerRef} style={{ width: '30vw', height: 'auto' }} className="pieBox" >
      <PieChart width={chartSize/2} height={chartSize/2}>
    <Pie
      data={data}
      cx="50%"
      cy="50%"
      outerRadius={chartSize / 5}
      fill="#8884d8"
      dataKey="value"
    >
      {data.map((entry, index) => (
        <Cell key={`cell-${index}`} onClick={() => pieChartClick(index)} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip />
    <Legend />
  </PieChart>
          </div>
          <div className="commentBox">
            {commentArray.map((label, index) => (
                      <div className="comments">{label}</div>
                    ))}
          </div>
      </div>
  </>
      );
  }
}

export default Data;
