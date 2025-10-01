import React from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
    return (
        <nav style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 2rem',
            backgroundColor: '#f8f9fa',
            borderBottom: '1px solid #eaeaea'
        }}>
            <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                Zaaki by Kisswani
            </div>
            <ul style={{
                display: 'flex',
                listStyle: 'none',
                margin: 0,
                padding: 0,
                gap: '1.5rem'
            }}>
                <li>
                    <Link href="/" style={{ textDecoration: 'none', color: '#333' }}>Home</Link>
                </li>
                <li>
                    <Link href="/edit-profile" style={{ textDecoration: 'none', color: '#333' }}>Edit Profile</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;