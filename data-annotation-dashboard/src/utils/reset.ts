import { resetIntents } from '@/redux/features/intentsSlice';
import { resetSmallTalks } from '@/redux/features/smallTalkSlice';
import { resetSmallTalksPermission } from '@/redux/features/smallTalksPermissionSlice';
import { resetSmallTalkTestings } from '@/redux/features/smallTalkTestingSlice';
import { resetTrainings } from '@/redux/features/trainingsSlice';
import { logout } from '@/redux/features/userSlice';
import { store } from '@/redux/store';


export const resetRedux = () => {
    store.dispatch(resetIntents());
    store.dispatch(resetSmallTalks());
    store.dispatch(resetSmallTalksPermission());
    store.dispatch(resetSmallTalkTestings());
    store.dispatch(resetTrainings());
    store.dispatch(logout());
};
