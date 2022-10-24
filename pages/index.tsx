import type { NextPage } from 'next';
import Nav from '../components/tools/Nav';
import Footer from '../components/main/Footer';
import HomeInfo from '../components/main/HomeInfo';
import Head from 'next/head';

const Home: NextPage = () => {
  return (
    <main>
      <Head>
        <title>LockedSwap</title>
      </Head>
      <div className="content">
        <Nav />
        <HomeInfo />
      </div>
      <Footer />
    </main>
  );
};

export default Home;
