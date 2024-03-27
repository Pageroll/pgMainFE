import React, { useEffect, useState } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { IoArrowBackCircle } from "react-icons/io5";
import { CgPlayTrackPrevR } from "react-icons/cg";
import { CgPlayTrackNextR } from "react-icons/cg";
import { IoMdSend } from "react-icons/io";
import { SiSendinblue } from "react-icons/si";
import gdsc from './Images/gdsc.jpg'
import gdscPost from './Images/gdsc_post.jpg'

function Message({ msgs }) {
    const [sender, setSender] = useState('')

    const onLoadCheck = ()=>{
        const roll = sessionStorage.getItem('roll');
        if(msgs.roll === roll){
            setSender('msgWin');
        }
        else{
            setSender('msgWinOther')
        }
    }
    useEffect(()=>{
         onLoadCheck()   
    },[])
    return (
        <>
            {/* <div className='messages'>
                <div className="msg">
                    <p className="roll">UE225031</p>
                    <h4 className='chatMsg'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Officia veritatis officiis consectetur vero nisi quae labore, ipsam dolorem. Repellendus, architecto.</h4>
                </div>
            </div> */}
            <div className={sender}>
                <div className="chat-message">
                    <div className="sender-info">
                        <span className="sender-name">{msgs.Name} </span>
                        <span className="sender-phone"> ECE-2nd</span>
                    </div>
                    <div className="message-content">
                        <p>{msgs.msg}</p>
                        <span className="timestamp">20:05</span>
                    </div>
                </div>
            </div>
        </>
    );
}

function Commmunity() {
    const [toggle, setToggle] = useState(false)
    const [messages, setMessages] = useState([]);
    const [myMsg, setMyMsg] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [ws, setWs] = useState(null);
    const [msgHis, setMsgHis] = useState([])
    const [msgCheck, setMsgCheck] = useState([])
    const [data, setData] = useState()

    const socket = new WebSocket(`${process.env.WEB_SOCKET_URL}`);
    socket.onopen = () => {
        console.log('Connected to WebSocket server');
    };

    const webSock = () => {
        socket.onmessage = (event) => {
            const roll = sessionStorage.getItem('roll');
            const username = sessionStorage.getItem('Name');
            if (event.data instanceof Blob) {
                // Handle Blob data (e.g., create a URL for downloading)
                console.log('Received Blob data:', event.data);
                const blob = event.data;
                const reader = new FileReader();
                reader.onload = async () => {
                    const data = reader.result;
                    try {
                        const message = JSON.parse(data);
                        if (message.text) {
                            // Log or use just the text content
                            console.log('Received Text:', message.text);
                            // Update the messages state if needed
                            const msgData = {
                                roll: message.roll,
                                msg: message.text,
                                Name: message.sender
                            }
                            setMessages(prev => [...prev, msgData]);
                        }
                    } catch (error) {
                        console.error('Error parsing message:', error);
                    }
                };
                reader.readAsText(blob);
            } else {
                try {
                    const message = JSON.parse(event.data);
                    setMessages([...messages, message]);
                } catch (error) {
                    console.error('Error parsing message:', error);
                }
            }
        };
        return () => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
        }
    }

    const onFirstLoad = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BASE_URL}chatStorage`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })
            if (res.ok) {
                const data = await res.json();
                const a = data.length;
                for (var i = 0; i < a; i++) {
                    const msg = data[i];
                    setMessages(prev => [...prev, msg])
                    console.log(messages, a)
                }
            }
        } catch (err) { console.log(err) }
    }

    useEffect(() => {
        webSock()
        onFirstLoad()
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const roll = sessionStorage.getItem('roll')
        const username = sessionStorage.getItem('Name')
        if (inputValue.trim() !== '') {
            socket.send(JSON.stringify({ text: inputValue, sender: username, roll: roll }));
            setInputValue('');
            try {
                const res = await fetch(`${process.env.REACT_APP_BASE_URL}chatStorage`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ roll, inputValue, username }),
                    credentials: "include"
                })
                if (res.ok) {
                    console.log('data')
                    const data = await res.json();
                    setData(data);
                }
            } catch (err) { console.log(err) }
            // console.log(messages);
            // console.log(msgHis, "msg history");
        }
    }

    const onLoad = () => {
        let a = document.querySelector('.commPost');
        let b = document.querySelector('.commChat');
        let c = document.querySelector('.commChatBack');
        a.style.left = "0px";
        a.style.width = "35%";
        b.style.width = "55%";
        c.style.display = "none";
        setToggle(false)
    }

    const onBack = () => {
        let a = document.querySelector('.commPost');
        let c = document.querySelector('.commChatBack');
        let b = document.querySelector('.commChat');
        a.style.left = "-60px";
        a.style.width = "0%";
        b.style.width = "90%";
        c.style.display = "block";
    }

    const onForward = () => {
        let a = document.querySelector('.commPost');
        let c = document.querySelector('.commChatBack');
        let b = document.querySelector('.commChat');
        a.style.left = "0px";
        a.style.width = "35%";
        c.style.display = "none";
        b.style.width = "55%";
    }

    useEffect(() => {
        setTimeout(() => {
            onLoad()
        }, 100)
    }, [])
    return (
        <>
            <div className="commPage">
                <div className="commPost">
                    <div onClick={() => {
                        setToggle((prev) => !prev)
                        onBack()
                    }} className="toggleBtn">
                        <CgPlayTrackPrevR color='rgb(118, 23, 187)' size='25' />
                    </div>
                    <p>Community Post</p>

                    <div className="commPostCard">
                        <div className="commCard">
                            <div className="cardProfile">
                                <div className='commProfileIcon'>
                                    <img src={gdsc} alt="gdsc" />
                                </div>
                                <div className="commProfileName">
                                    <p>GDSC UIET PU</p>
                                </div>
                                <BsThreeDotsVertical className="commProfileDot" size="15px" />
                            </div>
                        </div>
                        <div className="commProfilePost">
                            <img src={gdscPost} alt="post" />
                        </div>
                        <div className="commPostDes">
                            {/* <p>Hi fellows!👋<br /><br />

                            Ever wondered why there isn’t any techfest in our college?🤔<br /><br />

                            Well the wait is over, GDSC presents the official Techfest of UIET!❄🧑‍💻<br /><br />

                            And we are looking for a perfect team to organize the event,
                            Join the Techfest OC if you are willing to showcase your skills at making an event successful. 👥
                            <br /><br />
                            The recruitment interviews are happening this Thursday
                            25th January
                            Time: 3pm onwards
                            <br /><br />
                            Venue: LH 9, block 2
                            <br /><br />
                            🔗Register here:- https://forms.gle/VuYZdXAxg92Ux8iG6
                            <br /><br />
                            Join the WhatsApp group for all the updates: https://chat.whatsapp.com/DjtB1dCtH3NAYl3TqeEdl5
                            <br /><br />
                            With our best 🌟<br />
                            Team GDSC</p> */}
                            <p>
                                Hi fellows!👋<br /><br />

                                Ever wondered why there isn’t any techfest in our college?🤔<br /><br />

                                Well the wait is over, GDSC presents the official Techfest of...<b>Read more</b><br /><br />
                            </p>
                        </div>
                    </div>
                    <hr />
                    <br />
                    <div className="commPostCard">
                        <div className="commCard">
                            <div className="cardProfile">
                                <div className='commProfileIcon'>
                                    <img src={gdsc} alt="gdsc" />
                                </div>
                                <div className="commProfileName">
                                    <p>GDSC UIET PU</p>
                                </div>
                                <BsThreeDotsVertical className="commProfileDot" size="15px" />
                            </div>
                        </div>
                        <div className="commProfilePost">
                            <img src={gdscPost} alt="post" />
                        </div>
                        <div className="commPostDes">
                            {/* <p>Hi fellows!👋<br /><br />

                            Ever wondered why there isn’t any techfest in our college?🤔<br /><br />

                            Well the wait is over, GDSC presents the official Techfest of UIET!❄🧑‍💻<br /><br />

                            And we are looking for a perfect team to organize the event,
                            Join the Techfest OC if you are willing to showcase your skills at making an event successful. 👥
                            <br /><br />
                            The recruitment interviews are happening this Thursday
                            25th January
                            Time: 3pm onwards
                            <br /><br />
                            Venue: LH 9, block 2
                            <br /><br />
                            🔗Register here:- https://forms.gle/VuYZdXAxg92Ux8iG6
                            <br /><br />
                            Join the WhatsApp group for all the updates: https://chat.whatsapp.com/DjtB1dCtH3NAYl3TqeEdl5
                            <br /><br />
                            With our best 🌟<br />
                            Team GDSC</p> */}
                            <p>
                                Hi fellows!👋<br /><br />

                                Ever wondered why there isn’t any techfest in our college?🤔<br /><br />

                                Well the wait is over, GDSC presents the official Techfest of...<b>Read more</b><br /><br />
                            </p>
                        </div>
                    </div>
                    <hr />
                    <br />
                </div>
                <div className="commChat">
                    <CgPlayTrackNextR onClick={onForward} className='commChatBack' size='25' />
                    <p>Community Chat</p>
                    {/* <div className="mockChatBanner">
                        <center>
                            <SiSendinblue size='40' color='#89897d80' />
                            <p className='mockBannerCaption'>
                                Spark conversation in community
                            </p>
                        </center>
                    </div> */}
                    <div className="messages">
                        {messages.map((msg, index) => (
                            <Message key={index} msgs={msg} msgArr={msgHis} />
                        ))}
                    </div>
                    <div className="searchSecCommChat">
                        <input type="text" value={inputValue} placeholder='Search...' onChange={(e) => setInputValue(e.target.value)} />
                        <IoMdSend onClick={handleSubmit} className='sendMsgIcon' size='20' />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Commmunity