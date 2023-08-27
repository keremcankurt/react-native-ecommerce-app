import Favorites from "../components/Favorites";
import FollowingStores from "../components/FollowingStores";
import Orders from "../components/Orders";
import Profile from "../components/Profile";


export const profileLayoutActions =  [
    {
        text: 'Profile',
        comp: (<Profile/>)

    },
    {
        text: 'Favorites',
        comp: (<Favorites/>)
    },
    {
        text: 'Orders',
        comp: (<Orders/>)
    },
    {
        text: 'Following Stores',
        comp: (<FollowingStores/>)
    },
]