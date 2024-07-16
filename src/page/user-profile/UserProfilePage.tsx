import {useEffect, useState} from "react";
import {ProfileCard} from "../../component/user-profile/ProfileCard";
import {emptyUser, fetchUser} from "../../util/UserFetchUtil";

export default function UserProfilePage() {
    const [user, setUser] = useState(emptyUser);
    useEffect(() => {
        const fetchData = async () => {
            const res = await fetchUser();
            setUser(res.data);
        };
        fetchData();
    }, []);
    return (
        <>
            <ProfileCard user={user}/>
        </>
    );
}
