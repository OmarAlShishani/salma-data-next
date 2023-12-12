import Link from 'next/link';
import { styled } from '@mui/material';
import Image from 'next/image';

const Logo = () => {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
            }}
        >
            <Image
                src="/images/logos/logo salma.png"
                alt="logo"
                height={40}
                width={40}
                priority
            />
            <p
                style={{
                    textDecoration: 'none',
                    fontWeight: '700',
                    fontSize: '24px',
                    color:"#033e71"
                }}
            >
                Salma Ai
            </p>
        </div>
    );
};

export default Logo;
