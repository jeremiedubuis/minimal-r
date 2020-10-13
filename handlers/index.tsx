import React from 'react';

export { Home as Component } from '../views/Home/Home';

export const getServerSideProps = () => ({ title: 'Home' });
