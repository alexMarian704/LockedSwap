import React from 'react'
import { SimpleEGLDTxDemo } from '../components/demo/SimpleEGLDTxDemo'
import CardSwap from '../components/main/CardSwap'
import Nav from '../components/tools/Nav'
import { Text } from '@chakra-ui/react';
import Head from 'next/head';
import Footer from '../components/main/Footer';

const Swap = () => {
  return (
    <div>
      <Head>
        <title>Swap</title>
      </Head>
      <div className="content">
        <Nav />
        <Text fontSize="calc(30px + 0.2vw)" align={"center"} mt={8}>Swap</Text>
        <CardSwap />
      </div>
      <Footer />
    </div>
  )
}

export default Swap