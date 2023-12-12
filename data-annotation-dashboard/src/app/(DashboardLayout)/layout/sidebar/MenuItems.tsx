import {
    IconGenderEpicene,
    IconAperture,
    IconBrandDingtalk,
    IconUsersGroup,
} from '@tabler/icons-react';

import { uniqueId } from 'lodash';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';

const Menuitems = () => {
    const {
        user: { loggedInUser },
    } = useSelector((state: RootState) => state);
    const items = [
        {
            id: uniqueId(),
            title: 'Intents',
            icon: IconAperture,
            href: '/intents',
        },
        {
            id: uniqueId(),
            title: 'Small Talks',
            icon: IconBrandDingtalk,
            href: '/small-talks',
        },
        {
            id: uniqueId(),
            title: 'Entities',
            icon: IconGenderEpicene,
            href: '/entities',
        },
    ];
    if (loggedInUser.user_type === 'ADMIN') {
        items.unshift({
            id: uniqueId(),
            title: 'Users',
            icon: IconUsersGroup,
            href: '/users',
        });
    }
    items.unshift({
        navlabel: true,
        subheader: 'Home',
    } as any);
    return items;
};

export default Menuitems;
