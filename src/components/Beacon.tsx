import React from 'react'
import { Helmet } from 'react-helmet'

const HelpScoutBeacon: React.FC = () => (
        <div>
            <Helmet 
            script={[{ 
                type: 'text/javascript', 
                innerHTML: '!function(e,t,n){function a(){var e=t.getElementsByTagName("script")[0],n=t.createElement("script");n.type="text/javascript",n.async=!0,n.src="https://beacon-v2.helpscout.net",e.parentNode.insertBefore(n,e)}if(e.Beacon=n=function(t,n,a){e.Beacon.readyQueue.push({method:t,options:n,data:a})},n.readyQueue=[],"complete"===t.readyState)return a();e.attachEvent?e.attachEvent("onload",a):e.addEventListener("load",a,!1)}(window,document,window.Beacon||function(){});'
            }, {
                type: 'text/javascript',
                innerHTML: 'window.Beacon(\'init\', \'f459bd04-1c6f-4ed5-ae36-26a584971f73\')'
            }]} 
            />
        </div>
    )

export default HelpScoutBeacon;