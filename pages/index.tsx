import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { MyToken__factory } from '../types/ethers-contracts'
import diamond from "../diamond.json"
import { ethers } from 'ethers'

const Home: NextPage = () => {
  if (typeof window !== "undefined") {
    const provider = new ethers.providers.Web3Provider((window as any).ethereum)
    provider.send("eth_requestAccounts", []).then(accounts => {
      const signer = provider.getSigner()
      const myToken = MyToken__factory.connect(diamond.address, signer)
      myToken.initMyToken("SD", "sd", 8, '0xDEC3e07D46c46C089a323D62E60826D03716d7a2')
    });
  }
  
  return (
    <div>ciao</div>
  )
}

export default Home
