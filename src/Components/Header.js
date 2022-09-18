import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'


const Container = styled.div`
background: url("./images/pattern-bg.png") ;
  width: 100vw;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: white;
 position: relative;
  h2 {
  margin-bottom: 10px;
}
`
const Wrapper = styled.div`
width: 100vw;
height: 100vh
`

const Input = styled.input`
width: 100%;
height: 45px;
border: none;
padding-left: 20px;
font-size: 14px;
border-top-left-radius: 10px ;
border-bottom-left-radius: 10px ;
:focus{
    outline: none;
}
`
const Inputbox = styled.form`
display: flex;
width: 35%;
height: 47px;
border-radius: 10px;
align-items: center;
justify-content: center;
margin-bottom: 70px;
@media (max-width: 1000px) {
  margin-bottom: 120px;
  width: 80%;
}
`

const Button = styled.button`
width: 10%;
height: 47px;
background-color: black;
border-top-right-radius: 10px ;
border-bottom-right-radius: 10px ;
:hover{
  scale: 0.95;
  cursor: pointer;
}

@media (max-width: 500px) {
  width: 18%;
}
`

const CoordinatesCard = styled.div`
width: 80%;
display: flex;
min-height: 120px;
max-height: auto;
background-color: white;
border-radius: 10px ;
position: absolute;
align-items: center;
bottom: -60px;
z-index: 50;

:hover{
  
}

@media (max-width: 1000px) {
  flex-direction: column;
  bottom: -120px;
}

`

const CoordinatesInfoCard = styled.div`
display: flex;
flex-direction: column;
flex: 1;
background-color: white;
border-radius: 10px ;
align-items: center;
bottom: -60px;
z-index: 70;
color: black;
:hover{
  scale: 0.95;
 
}

p {
  margin-bottom: 10px;
  text-transform: uppercase;
  font-size: 12px;
}



`

const ErrorMessage = styled.span`
color: white;
background-color: red;
font-weight: bold;
padding: 10px;
border-radius: 5px;
font-size: 14px;
display: flex;
align-items: center;
justify-content: center;
`;



const Header = () => {
const [ipError, setIpError] = useState("");
const [isSubmit, setIsSubmit] = useState(false);
const [ipAddressUi, setIpAdrress] = useState("");

const validIP = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

const ip = ipAddressUi;
const api_key = 'at_R4fC5jFJumGZkP9ijcrPtteqrOz0Z';
const api_url =  'https://geo.ipify.org/api/v1?';
const url = api_url + 'apiKey=' + api_key + '&ipAddress=' +  ip;


const [city, setCity] = useState("");
const [timeZone, setTimezone] = useState("");
const [isp, setIsp] = useState("");
const [coordinateslat, setCoordinatesLat] = useState("");
const [coordinateslng, setCoordinatesLng] = useState("");
const [ipAddress, setIpAdrressAPI] = useState("");


const getIpData = useCallback(async() => {
  try{
    const res = await axios.get(url);
    console.log(res.data)
    setCity(res.data.location.city)
    setIsp(res.data.isp)
    setTimezone(res.data.location.timezone)
    setIpAdrressAPI(res.data.ip)
    setCoordinatesLat(res.data.location.lat)
    setCoordinatesLng(res.data.location.lng)
    console.log(coordinateslat)
    
  }
  catch(err){

  }
},[ipAddressUi, coordinateslat, coordinateslng])

 const lat = coordinateslat
 const lng =coordinateslng

const validate = (ipAddressUi) =>{
  var error = "";
  if(ipAddressUi === "" ) {
    error = "Please enter an IP Address...";
  } else if(!validIP.test(ipAddressUi)){
    error = "Invalid IP Address...";
  }
  return error;
}

const handleSubmit = (e) => {
  e.preventDefault();
  setIpError(validate(ipAddressUi));
  setIsSubmit(true);
  getIpData()
}
useEffect(() => {
  if(ipError ==="" && isSubmit) {
   
  }
   },[ipError, isSubmit])

   useEffect(()=>{
    getIpData();
   
   },[])
 
 const RecenterAutomatically = ({lat,lng})=>{
  const map = useMap()
  useEffect(() => {
   map.setView([lat,lng]);
  }, [lat, lng]);
 }


  return (
  <Wrapper>
   <Container>
  { ipError !== "" && <ErrorMessage>{ipError}</ErrorMessage>}
    <h2 style={{marginTop:"10px"}}>IP Address Tracker</h2>
    <Inputbox onSubmit={handleSubmit}>
    
    <Input placeholder=' Search for any IP address or domain'
    onChange={(e) => setIpAdrress(e.target.value)}
    setIpAdrress={setIpAdrress}
    
    />
    <Button>
  <img src='./images/icon-arrow.svg' alt='arrow' style={{ }} />
    </Button>
  
    </Inputbox>
    <CoordinatesCard>
    <CoordinatesInfoCard>
      <p>IP Address</p>
      <h2>{ipAddress}</h2>
    </CoordinatesInfoCard>
    <CoordinatesInfoCard>
      <p>Location</p>
      <h2>{city}</h2>
      </CoordinatesInfoCard>
    <CoordinatesInfoCard>
    <p>Timezone</p>
      <h2>UTC{timeZone}</h2>
      </CoordinatesInfoCard>
    <CoordinatesInfoCard>
      <p>Isp</p>
      <h2>{isp}</h2>
      </CoordinatesInfoCard>
    </CoordinatesCard>
   </Container>
   <MapContainer style={{width:"100%", height:"100%", zIndex:"40"}} center={[lat,lng]} zoom={13} scrollWheelZoom={true}>
  <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
  <Marker position={[lat,lng]} >
    <Popup>
      Timezone : {timeZone} <br/>
      City : {city} <br/>
      Internet service provider : {isp}
    </Popup>
  </Marker>
  <RecenterAutomatically lat={lat} lng={lng} />
</MapContainer>
   </Wrapper>
  )
}

export default Header

