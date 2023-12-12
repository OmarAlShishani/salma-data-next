import { parseCookies } from 'nookies';
import isServer from './isServer';

const getCookies = (ctx?: any) => {
    if (isServer()) {
        return parseCookies(ctx);
    } else {
        return parseCookies();
    }
};

export default getCookies;
